/*
 * This program creates a simple network which uses an ADR algorithm to set up
 * the Spreading Factors of the devices in the Network.
 */

#include "ns3/command-line.h"
#include "ns3/config.h"
#include "ns3/core-module.h"
#include "ns3/forwarder-helper.h"
#include "ns3/gateway-lora-phy.h"
#include "ns3/hex-grid-position-allocator.h"
#include "ns3/log.h"
#include "ns3/lora-channel.h"
#include "ns3/lora-device-address-generator.h"
#include "ns3/lora-helper.h"
#include "ns3/lora-phy-helper.h"
#include "ns3/lorawan-mac-helper.h"
#include "ns3/mobility-helper.h"
#include "ns3/network-module.h"
#include "ns3/network-server-helper.h"
#include "ns3/periodic-sender-helper.h"
#include "ns3/periodic-sender.h"
#include "ns3/point-to-point-module.h"
#include "ns3/random-variable-stream.h"
#include "ns3/rectangle.h"
#include "ns3/string.h"
// for energy
#include "ns3/basic-energy-source-helper.h"
#include "ns3/energy-module.h"
#include "ns3/file-helper.h"
#include "ns3/lora-radio-energy-model-helper.h"
// for buildings
#include "utils.h"

#include "ns3/building-allocator.h"
#include "ns3/building-penetration-loss.h"
#include "ns3/buildings-helper.h"
#include "ns3/correlated-shadowing-propagation-loss-model.h"
#include "ns3/forwarder-helper.h"

using namespace ns3;
using namespace lorawan;

NS_LOG_COMPONENT_DEFINE("LoRaWISEP");

// Trace sources that are called when a node changes its DR or TX power
void
OnDataRateChange(uint8_t oldDr, uint8_t newDr)
{
    NS_LOG_DEBUG("DR" << unsigned(oldDr) << " -> DR" << unsigned(newDr));
}

void
OnTxPowerChange(double oldTxPower, double newTxPower)
{
    NS_LOG_DEBUG(oldTxPower << " dBm -> " << newTxPower << " dBm");
}

// bool verbose = false;
bool adrEnabled = true;
bool initializeSF = false;
double radius = 5000; // Note that due to model updates, 7500 m is no longer the maximum
                        // distance
bool fromfile = true;
int numRun = 1;

// devices configuration
std::string file_endevices = "";

// gateways configuration
std::string file_gateway = "";

std::string out_folder = "";
// network configuration
int realisticChannelModel = true;
int appPeriodSeconds = 600;
double simulationTime = 1200;
std::string adrType = "ns3::AdrComponent";

int
main(int argc, char* argv[])
{
    CommandLine cmd;
    // cmd.AddValue ("verbose", "Whether to print output or not", verbose);
    // cmd.AddValue ("MultipleGwCombiningMethod",
    // "ns3::AdrComponent::MultipleGwCombiningMethod");
    // cmd.AddValue ("MultiplePacketsCombiningMethod",
    // "ns3::AdrComponent::MultiplePacketsCombiningMethod");
    // cmd.AddValue ("HistoryRange", "ns3::AdrComponent::HistoryRange");
    // cmd.AddValue ("MType", "ns3::EndDeviceLorawanMac::MType");
    // cmd.AddValue ("EDDRAdaptation", "ns3::EndDeviceLorawanMac::EnableEDDataRateAdaptation");
    // cmd.AddValue ("ChangeTransmissionPower",
    // "ns3::AdrComponent::ChangeTransmissionPower");
    //  cmd.AddValue ("AdrEnabled", "Whether to enable ADR", adrEnabled);
    //  cmd.AddValue ("nDevices", "Number of devices to simulate", nDevices);
    //  cmd.AddValue ("PeriodsToSimulate", "Number of periods to simulate", nPeriods);
    cmd.AddValue("numRun", "Number of Running", numRun);
    cmd.AddValue("initializeSF", "Whether to initialize the SFs", initializeSF);
    cmd.AddValue("MaxTransmissions", "ns3::EndDeviceLorawanMac::MaxTransmissions");
    cmd.AddValue("file_endevices", "Path to the devices configuration file", file_endevices);
    cmd.AddValue("file_gateways", "Path to the gateways configuration file", file_gateway);
    cmd.AddValue("out_folder", "Path to the output folder", out_folder);

    cmd.Parse(argc, argv);

    // Logging

    LogComponentEnable("AdrExample", LOG_LEVEL_ALL);
    // LogComponentEnable ("LoraPacketTracker", LOG_LEVEL_ALL);
    // LogComponentEnable ("NetworkServer", LOG_LEVEL_ALL);
    // LogComponentEnable ("NetworkController", LOG_LEVEL_ALL);
    // LogComponentEnable ("NetworkScheduler", LOG_LEVEL_ALL);
    // LogComponentEnable ("NetworkStatus", LOG_LEVEL_ALL);
    // LogComponentEnable ("EndDeviceStatus", LOG_LEVEL_ALL);
    //  LogComponentEnable ("AdrComponent", LOG_LEVEL_ALL);
    // LogComponentEnable("ClassAEndDeviceLorawanMac", LOG_LEVEL_ALL);
    // LogComponentEnable ("LogicalLoraChannelHelper", LOG_LEVEL_ALL);
    // LogComponentEnable ("MacCommand", LOG_LEVEL_ALL);
    // LogComponentEnable ("AdrExploraSf", LOG_LEVEL_ALL);
    // LogComponentEnable ("AdrExploraAt", LOG_LEVEL_ALL);
    // LogComponentEnable ("EndDeviceLorawanMac", LOG_LEVEL_ALL);
    //  LogComponentEnableAll (LOG_PREFIX_FUNC);
    //  LogComponentEnableAll (LOG_PREFIX_NODE);
    //  LogComponentEnableAll (LOG_PREFIX_TIME);

    // Set the EDs to require Data Rate control from the NS
    Config::SetDefault("ns3::EndDeviceLorawanMac::DRControl", BooleanValue(true));

    // Create a simple wireless channel
    ///////////////////////////////////
    NS_LOG_INFO("End Devices File: " << file_endevices);
    int nDevices = getFileSize(file_endevices);
    std::cout << "nDevices: " << nDevices << std::endl;
    EndDevice end[nDevices];
    GetEndDeviceFromFile(end, file_endevices);
    NS_LOG_INFO("Gateways File: " << file_gateway);
    int nGateways = getFileSize(file_gateway);
    std::cout << "nGateways: " << nGateways << std::endl;
    Gateway gw[nGateways];
    GetGatewayFromFile(gw, file_gateway);

    NS_LOG_INFO("numRun: " << numRun);
    std::cout << "out_folder: " << out_folder << std::endl;

    Ptr<LogDistancePropagationLossModel> loss = CreateObject<LogDistancePropagationLossModel>();
    loss->SetPathLossExponent(3.76);
    loss->SetReference(1, 7.7);

    if (realisticChannelModel)
    {
        NS_LOG_INFO("Using realistic channel model");
        // Create the correlated shadowing component
        Ptr<CorrelatedShadowingPropagationLossModel> shadowing =
            CreateObject<CorrelatedShadowingPropagationLossModel>();

        // Aggregate shadowing to the logdistance loss
        loss->SetNext(shadowing);

        // Add the effect to the channel propagation loss
        Ptr<BuildingPenetrationLoss> buildingLoss = CreateObject<BuildingPenetrationLoss>();

        shadowing->SetNext(buildingLoss);
    }

    Ptr<PropagationDelayModel> delay = CreateObject<ConstantSpeedPropagationDelayModel>();

    Ptr<LoraChannel> channel = CreateObject<LoraChannel>(loss, delay);

    // Helpers
    //////////

    /***********
     *  Setup  *
     ***********/

    // Create the time value from the period
    Time appPeriod = Seconds(appPeriodSeconds);
    NS_LOG_INFO("Period: " << appPeriod);

    // Mobility
    MobilityHelper mobility;
    mobility.SetPositionAllocator("ns3::UniformDiscPositionAllocator",
                                  "rho",
                                  DoubleValue(radius),
                                  "X",
                                  DoubleValue(0.0),
                                  "Y",
                                  DoubleValue(0.0));
    mobility.SetMobilityModel("ns3::ConstantPositionMobilityModel");

    // Create the LoraPhyHelper
    LoraPhyHelper phyHelper = LoraPhyHelper();
    phyHelper.SetChannel(channel);

    // Create the LorawanMacHelper
    LorawanMacHelper macHelper = LorawanMacHelper();

    // Create the LoraHelper
    LoraHelper helper = LoraHelper();
    helper.EnablePacketTracking();

    ////////////////
    // Create EDs //
    ///////////////
    NodeContainer endDevices;
    endDevices.Create(nDevices);
    NS_LOG_INFO("Number of end devices: " << nDevices);

    // Install mobility model on fixed nodes
    mobility.Install(endDevices);

    int counter = 0;
    for (NodeContainer::Iterator j = endDevices.Begin(); j != endDevices.End(); ++j, counter++)
    {
        Ptr<MobilityModel> mobility = (*j)->GetObject<MobilityModel>();
        Vector position = mobility->GetPosition();
        // uptade
        if (fromfile)
        {
            position.x = end[counter].coordX;
            position.y = end[counter].coordY;
            // position.z = end[counter].coordZ;
        }
        else
        {
            position.z = 1.2;
        }
        position.z = 1.2;
        mobility->SetPosition(position);
    }

    // Create a LoraDeviceAddressGenerator
    uint8_t nwkId = 54;
    uint32_t nwkAddr = 1864;
    Ptr<LoraDeviceAddressGenerator> addrGen =
        CreateObject<LoraDeviceAddressGenerator>(nwkId, nwkAddr);

    // Create the LoraNetDevices of the end devices
    phyHelper.SetDeviceType(LoraPhyHelper::ED);
    macHelper.SetDeviceType(LorawanMacHelper::ED_A);
    macHelper.SetAddressGenerator(addrGen);
    // macHelper.SetRegion (LorawanMacHelper::EU);
    NetDeviceContainer endDevicesNetDevices = helper.Install(phyHelper, macHelper, endDevices);
    // Now end devices are connected to the channel

    // Connect trace sources
    for (NodeContainer::Iterator j = endDevices.Begin(); j != endDevices.End(); ++j)
    {
        Ptr<Node> node = *j;
        Ptr<LoraNetDevice> loraNetDevice = node->GetDevice(0)->GetObject<LoraNetDevice>();
        Ptr<LoraPhy> phy = loraNetDevice->GetPhy();
    }
    NS_LOG_DEBUG("End devices created");
    ////////////////
    // Create GWs //
    ////////////////
    NS_LOG_INFO("Number of gateways: " << nGateways);
    NodeContainer gateways;
    gateways.Create(nGateways);
    Ptr<ListPositionAllocator> allocator = CreateObject<ListPositionAllocator>();
    counter = 0;
    for (NodeContainer::Iterator j = gateways.Begin(); j != gateways.End(); ++j, counter++)
    {
        double gwa = 0;
        double gwb = 0;
        double gwc = 15;
        if (fromfile)
        {
            gwa = gw[counter].coordX;
            gwb = gw[counter].coordY;
            // std::cout << "gwa: " << gwa << " gwb: " << gwb << std::endl;
            // gwc = gw[counter].coordZ;
        }
        allocator->Add(Vector(gwa, gwb, gwc)); // adiciona ao vetor
        mobility.SetPositionAllocator(allocator);
    }
    mobility.Install(gateways);

    // Create the LoraNetDevices of the gateways
    phyHelper.SetDeviceType(LoraPhyHelper::GW);
    macHelper.SetDeviceType(LorawanMacHelper::GW);
    helper.Install(phyHelper, macHelper, gateways);
    NS_LOG_DEBUG("Gateways created");
    /**********************
     *  Handle buildings  *
     **********************/
    NS_LOG_DEBUG("Creating buildings");

    double xLength = 200;
    double deltaX = 100;
    double yLength = 200;
    double deltaY = 100;

    // double xLength = 130;
    // double deltaX = 32;
    // double yLength = 64;
    // double deltaY = 17;

    // Cálculo do número de edifícios ao longo de um lado da área quadrática
    int gridWidth = (10000 / (xLength + deltaX));
    int gridHeight = (10000 / (yLength + deltaY));
    if (realisticChannelModel == false)
    {
        gridWidth = 0;
        gridHeight = 0;
    }

    Ptr<GridBuildingAllocator> gridBuildingAllocator;
    gridBuildingAllocator = CreateObject<GridBuildingAllocator>();
    gridBuildingAllocator->SetAttribute("GridWidth", UintegerValue(gridWidth));
    gridBuildingAllocator->SetAttribute("LengthX", DoubleValue(xLength));
    gridBuildingAllocator->SetAttribute("LengthY", DoubleValue(yLength));
    gridBuildingAllocator->SetAttribute("DeltaX", DoubleValue(deltaX));
    gridBuildingAllocator->SetAttribute("DeltaY", DoubleValue(deltaY));
    gridBuildingAllocator->SetAttribute("Height", DoubleValue(6));
    gridBuildingAllocator->SetBuildingAttribute("NRoomsX", UintegerValue(2));
    gridBuildingAllocator->SetBuildingAttribute("NRoomsY", UintegerValue(4));
    gridBuildingAllocator->SetBuildingAttribute("NFloors", UintegerValue(2));
    gridBuildingAllocator->SetAttribute("MinX", DoubleValue(0));
    gridBuildingAllocator->SetAttribute("MinY", DoubleValue(0));
    BuildingContainer bContainer = gridBuildingAllocator->Create(gridWidth * gridHeight);

    // std::cout << "buildings:"
            //   << " " << bContainer.GetN() << std::endl;
    // for (std::vector<Ptr<Building>>::const_iterator it = bContainer.Begin (); it !=
    // bContainer.End (); ++it)
    //     {
    //       Box boundaries = (*it)->GetBoundaries ();
    //       std::cout << boundaries << std::endl;
    //     }
    BuildingsHelper::Install(endDevices);
    BuildingsHelper::Install(gateways);

    NS_LOG_DEBUG("Buildings created");
    // Connect our traces
    Config::ConnectWithoutContext(
        "/NodeList/*/DeviceList/0/$ns3::LoraNetDevice/Mac/$ns3::EndDeviceLorawanMac/TxPower",
        MakeCallback(&OnTxPowerChange));
    Config::ConnectWithoutContext(
        "/NodeList/*/DeviceList/0/$ns3::LoraNetDevice/Mac/$ns3::EndDeviceLorawanMac/DataRate",
        MakeCallback(&OnDataRateChange));

    // Print the buildings

    std::ofstream myfile;
    myfile.open(out_folder + "/buildings/buildings" + std::to_string(numRun) + ".txt");
    std::vector<Ptr<Building>>::const_iterator it;
    int j = 1;
    for (it = bContainer.Begin(); it != bContainer.End(); ++it, ++j)
    {
        Box boundaries = (*it)->GetBoundaries();
        myfile << "set object " << j << " rect from " << boundaries.xMin << "," << boundaries.yMin
               << " to " << boundaries.xMax << "," << boundaries.yMax << std::endl;
    }
    myfile.close();

    // Do not set spreading factors up: we will wait for the NS to do this
    if (initializeSF)
    {
        macHelper.SetSpreadingFactorsUp(endDevices, gateways, channel);
    }

    NS_LOG_DEBUG("Completed configuration");

    /*********************************************
     *  Install applications on the end devices  *
     *********************************************/

    NS_LOG_DEBUG("Installing applications on the end devices");

    Time appStopTime = Seconds(simulationTime);
    PeriodicSenderHelper appHelper = PeriodicSenderHelper();
    appHelper.SetPeriod(Seconds(appPeriodSeconds));
    appHelper.SetPacketSize(20);
    ApplicationContainer appContainer = appHelper.Install(endDevices);

    appContainer.Start(Seconds(0));
    appContainer.Stop(appStopTime);
    NS_LOG_DEBUG("Applications installed");
    ////////////
    // Create NS
    ////////////
    NS_LOG_DEBUG("Creating NS");
    NodeContainer networkServers;
    networkServers.Create(1);

    // Install the NetworkServer application on the network server
    NetworkServerHelper networkServerHelper;
    networkServerHelper.SetGateways(gateways);
    networkServerHelper.SetEndDevices(endDevices);
    networkServerHelper.EnableAdr(adrEnabled);
    networkServerHelper.SetAdr(adrType);
    networkServerHelper.Install(networkServers);
    NS_LOG_DEBUG("NS created");
    // Install the Forwarder application on the gateways
    ForwarderHelper forwarderHelper;
    forwarderHelper.Install(gateways);

    // Connect our traces
    Config::ConnectWithoutContext(
        "/NodeList/*/DeviceList/0/$ns3::LoraNetDevice/Mac/$ns3::EndDeviceLorawanMac/TxPower",
        MakeCallback(&OnTxPowerChange));
    Config::ConnectWithoutContext(
        "/NodeList/*/DeviceList/0/$ns3::LoraNetDevice/Mac/$ns3::EndDeviceLorawanMac/DataRate",
        MakeCallback(&OnDataRateChange));

    /************************
     * Install Energy Model *
     ************************/
    BasicEnergySourceHelper basicSourceHelper;
    LoraRadioEnergyModelHelper radioEnergyHelper;

    // configure energy source
    basicSourceHelper.Set("BasicEnergySourceInitialEnergyJ", DoubleValue(10000)); // Energy in J
    basicSourceHelper.Set("BasicEnergySupplyVoltageV", DoubleValue(3.3));

    radioEnergyHelper.Set("StandbyCurrentA", DoubleValue(0.0014));
    radioEnergyHelper.Set("TxCurrentA", DoubleValue(0.028));
    radioEnergyHelper.Set("SleepCurrentA", DoubleValue(0.0000015));
    radioEnergyHelper.Set("RxCurrentA", DoubleValue(0.0112));

    radioEnergyHelper.SetTxCurrentModel("ns3::LinearLoraTxCurrentModel");

    // install source on EDs' nodes
    EnergySourceContainer sources = basicSourceHelper.Install(endDevices);
    Names::Add("/Names/EnergySource", sources.Get(0));

    // install device model
    DeviceEnergyModelContainer deviceModels =
        radioEnergyHelper.Install(endDevicesNetDevices, sources);

    /**********************
     * Print output files *   man o`zim qo`ydim
     ********************/
    FileHelper fileHelper;
    NS_LOG_DEBUG("Saving...");
    getStatus(endDevices,
              gateways,
              channel,
              out_folder + "/status/status" + std::to_string(numRun) + ".csv");

    helper.DoPrintDeviceStatus(endDevices, gateways, out_folder + "/ed.dat");
    // Activate printing of ED MAC parameters
    Time stateSamplePeriod = Seconds(appPeriodSeconds);
    helper.EnablePeriodicDeviceStatusPrinting(endDevices,
                                              gateways,
                                              out_folder + "/nodeData.txt",
                                              stateSamplePeriod);
    // totPacketsSent - receivedPackets - interferedPackets - noMoreGwPackets -
    // underSensitivityPackets - lostBecauseTxPackets
    helper.EnablePeriodicPhyPerformancePrinting(gateways,
                                                out_folder + "/phyPerformance/phyPerformance" +
                                                    std::to_string(numRun) + ".csv",
                                                stateSamplePeriod);
    helper.EnablePeriodicGlobalPerformancePrinting(
        out_folder + "/globalPerformance/globalPerformance" + std::to_string(numRun) + ".csv",
        stateSamplePeriod);

    fileHelper.ConfigureFile(out_folder + "/battery/battery-level" + std::to_string(numRun),
                             FileAggregator::COMMA_SEPARATED);
    fileHelper.WriteProbe("ns3::DoubleProbe", "/Names/EnergySource/RemainingEnergy", "Output");

    // Start simulation
    NS_LOG_DEBUG("Starting simulation...");
    Simulator::Stop(appStopTime + Hours(1));
    Simulator::Run();
    Simulator::Destroy();

    // std::cout << tracker.CountMacPacketsGlobally(Seconds (appPeriodSeconds * (nPeriods - 2)),
    //                                              Seconds (appPeriodSeconds * (nPeriods - 1))) <<
    //                                              std::endl;

    LoraPacketTracker& tracker = helper.GetPacketTracker();
    NS_LOG_INFO("Computing performance metrics...");
    std::cout << tracker.CountMacPacketsGlobally(Seconds(0), appStopTime + Hours(1)) << std::endl;

    return 0;
}
