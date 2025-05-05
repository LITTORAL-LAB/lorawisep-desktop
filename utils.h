#ifndef FILE_H
#define FILE_H

#include "ns3/point-to-point-module.h"
#include "ns3/forwarder-helper.h"
#include "ns3/network-server-helper.h"
#include "ns3/lora-channel.h"
#include "ns3/mobility-helper.h"
#include "ns3/lora-phy-helper.h"
#include "ns3/lorawan-mac-helper.h"
#include "ns3/lora-helper.h"
#include "ns3/gateway-lora-phy.h"
#include "ns3/periodic-sender.h"
#include "ns3/periodic-sender-helper.h"
#include "ns3/log.h"
#include "ns3/string.h"
#include "ns3/command-line.h"
#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/lora-device-address-generator.h"
#include "ns3/random-variable-stream.h"
#include "ns3/config.h"
#include "ns3/rectangle.h"
#include "ns3/hex-grid-position-allocator.h"
//for energy
#include "ns3/basic-energy-source-helper.h"
#include "ns3/lora-radio-energy-model-helper.h"
#include "ns3/file-helper.h"
#include "ns3/energy-module.h"
//for buildings
#include "ns3/correlated-shadowing-propagation-loss-model.h"
#include "ns3/building-penetration-loss.h"
#include "ns3/building-allocator.h"
#include "ns3/buildings-helper.h"
// for geo
#include "ns3/geographic-positions.h"

#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>

using namespace ns3;
using namespace lorawan;
/*Coordenate struct*/
struct coord
{
  double latitude, longitude, altitude;
};

/* End device struct for file [update] */
struct EndDevice
{
  float coordX;
  float coordY;
  // float coordZ;
  int gateway;
};

/* Gateway struct for file [uptade] */
struct Gateway
{
  int ncluster;
  float coordX;
  float coordY;
  // float coordZ;
};

/* Return the number of lines from a file */
int
getFileSize (const std::string &fileName)
{
  int numLines = 0;
  std::string unused;
  std::ifstream file (fileName.c_str ());
  while (std::getline (file, unused))
    ++numLines;
  return numLines;
}

/*Get end devices from a file [uptade] */
void
GetEndDeviceFromFile (EndDevice *x, std::string file)
{
  std::ifstream file_endDevices (file);
  std::string line;
  std::string delimiter;
  std::vector<std::string> tokens;
  // double enda, endb;
  // Lendo do arquivo os geteways
  double enda = 0.0, endb = 0.0;
  // endc = 0.0;
  // int numLines = 0;
  // std::vector<int> gw;
  std::vector<float> enX;
  std::vector<float> enY;
  std::vector<float> enZ;

  if (file_endDevices.is_open ())
    {
      while (std::getline (file_endDevices, line))
        {
          // ++numLines;
          // std::cout << "LINHA line.c_str() ===>: " << line.c_str() << std::endl;
          std::stringstream check (line.c_str ());
          while (getline (check, delimiter, ','))
            {
              tokens.push_back (delimiter);
            }
          // informações da leitura

          // dados endDevice_a
          // coordenadas latitude
          std::string doublestr_enda = tokens[0];
          std::stringstream dstream_enda (doublestr_enda);
          dstream_enda >> enda;

          // dados end_Device_b
          // coordenadas longitude
          std::string doublestr_endb = tokens[1];
          std::stringstream dstream_endb (doublestr_endb);
          dstream_endb >> endb;

          // dados end_device_c
          // coordenadas altitude
          // std::string doublestr_endc = tokens[2];
          // std::stringstream dstream_endc (doublestr_endc);
          // dstream_endc >> endc;

          Vector cartesian = (GeographicPositions::GeographicToCartesianCoordinates (
              enda, endb, 0, GeographicPositions::SPHERE));
          enX.insert (enX.end (), cartesian.x);
          enY.insert (enY.end (), cartesian.y);
          // enZ.insert (enZ.end (), cartesian.z);

          // enX.insert (enX.end (), enda);
          // enY.insert (enY.end (), endb);
          // enZ.insert (enZ.end (), endc);

          tokens.clear ();
        }
      file_endDevices.close ();
    }
  else
    {
      std::cout << "ERRO ==> ao ler arquivo file_endDevices2" << std::endl;
    } // fim else leitura do arquivo Gateway
  for (int j = 0; j < getFileSize (file); j++)
    {
      x[j].coordX = enX[j];
      x[j].coordY = enY[j];
      // x[j].coordZ = enZ[j];
      // std::cout << x[j].coordX << " " << x[j].coordY << " " << std::endl;
      // std::cout << "=-=-==-=-=-=-=-==-=-=--=" << std::endl;
    }
    // std::cout << "Nº de devices: " << numLines << std::endl;
}

/*Get gateways from a file [uptade] */
void
GetGatewayFromFile (Gateway *gw, std::string file)
{
  // lendo o arquivo endDevices
  std::ifstream file_endDevices3 (file);
  std::string line;
  std::string delimiter;
  std::vector<std::string> tokens;

  // Lendo do arquivo os geteways
  // int numLines = 0;
  // double clst = 0.0;
  double gwa = 0.0;
  double gwb = 0.0;
  // double gwc = 0.0;

  // std::vector<int> cluster;
  std::vector<float> latGW;
  std::vector<float> longGW;
  // std::vector<float> altGW;

  if (file_endDevices3.is_open ())
    {
      while (std::getline (file_endDevices3, line))
        {
          // ++numLines;
          //std::cout << "LINHA line.c_str() ===>: " << line.c_str() << std::endl;
          std::stringstream check (line.c_str ());
          while (getline (check, delimiter, ','))
            {
              tokens.push_back (delimiter);
            }

          // dados cluster
          // std::string doublestr_clst = tokens[0];
          // std::stringstream dstream_clst (doublestr_clst);
          // dstream_clst >> clst;

          // dados latitude
          std::string doublestr_gwa = tokens[0];
          std::stringstream dstream_gwa (doublestr_gwa);
          dstream_gwa >> gwa;

          // dados longitude
          std::string doublestr_gwb = tokens[1];
          std::stringstream dstream_gwb (doublestr_gwb);
          dstream_gwb >> gwb;

          // dados altitude
          // std::string doublestr_gwc = tokens[2];
          // std::stringstream dstream_gwc (doublestr_gwc);
          // dstream_gwc >> gwc;

          Vector cartesian = (GeographicPositions::GeographicToCartesianCoordinates (
              gwa, gwb, 0, GeographicPositions::SPHERE));
          
          latGW.insert (latGW.end (), cartesian.x);
          longGW.insert (longGW.end (), cartesian.y);
          // altGW.insert (altGW.end (), cartesian.z);

          // latGW.insert (latGW.end (), gwa);
          // longGW.insert (longGW.end (), gwb);
          // altGW.insert (altGW.end (), gwc);

          tokens.clear ();
        }
      file_endDevices3.close ();
    }
  else
    {
      std::cout << "ERRO ==> ao ler arquivo file_endDevices3" << std::endl;
    }
  // fim else leitura do arquivo Gateway
  for (int j = 0; j < getFileSize (file); j++)
    {
      gw[j].coordX = latGW[j];
      gw[j].coordY = longGW[j];
      // gw[j].coordZ = altGW[j];
      // std::cout << gw[j].coordX << " " << gw[j].coordY<< " " << gw[j].coordZ << std::endl;
      // std::cout << "=-=-==-=-=-=-=-==-=-=--=" << std::endl;
    }
    // std::cout << "Nº de gateways: " << numLines << std::endl;
}

  //Bandwidth (Hz)
  const int B = 125000;

  //Noise Figure (dB)
  const int NF = 6;

double RxPowerToSNR (double transmissionPower)
{
  //The following conversion ignores interfering packets
  return transmissionPower + 174 - 10 * log10 (B) - NF;
}

// Trace sources that are called when a node changes its DR or TX power
void
OnDataRateChange(uint8_t oldDr, uint8_t newDr)
{
    std::cout << "DR" << unsigned(oldDr) << " -> DR" << unsigned(newDr) << std::endl;
}

void
OnTxPowerChange(double oldTxPower, double newTxPower)
{
    std::cout << oldTxPower << " dBm -> " << newTxPower << " dBm" << std::endl;
}

void
getStatus (ns3::NodeContainer endDevices, ns3::NodeContainer gateways, ns3::Ptr<ns3::lorawan::LoraChannel> channel,
           std::string file)
{
  int counter = 0;
  const char *c = file.c_str ();
  std::ofstream outputFile;
  outputFile.open (c, std::ofstream::out | std::ofstream::trunc);
  outputFile << "edx," << "edy," << "edz," << "gwx," << "gwy," << "gwz,"
             << "dr," << "rssi," << "dist," << "delay," << "snr" << std::endl;
  for (NodeContainer::Iterator j = endDevices.Begin (); j != endDevices.End (); ++j, counter++)
    {
      Ptr<Node> object = *j;
      Ptr<MobilityModel> position = object->GetObject<MobilityModel> ();

      // Try computing the distance from each gateway and find the best one
      Ptr<Node> bestGateway = gateways.Get (0);
      Ptr<MobilityModel> bestGatewayPosition = bestGateway->GetObject<MobilityModel> ();

      // Assume devices transmit at 14 dBm --> max_transmissionPower
      double highestRxPower = channel->GetRxPower (14, position, bestGatewayPosition);

      ///----------------- Set DR(SF) ------------------------
      Ptr<NetDevice> netDevice = object->GetDevice (0);
      Ptr<LoraNetDevice> loraNetDevice = netDevice->GetObject<LoraNetDevice> ();
      Ptr<ClassAEndDeviceLorawanMac> mac =
          loraNetDevice->GetMac ()->GetObject<ClassAEndDeviceLorawanMac> ();
      int dr = int (mac->GetDataRate ()); // Set DR(SF)
      ///-----------------------------------------------------
      Ptr<PropagationDelayModel> delay = CreateObject<ConstantSpeedPropagationDelayModel> ();
      Time t_delay =
          delay->GetDelay (position, bestGatewayPosition); // sendMobility,receiverMobility
      double distance = position->GetDistanceFrom (bestGatewayPosition);

      for (NodeContainer::Iterator currentGw = gateways.Begin () + 1; currentGw != gateways.End ();
           ++currentGw)
        {
          // Compute the power received from the current gateway
          Ptr<Node> curr = *currentGw;
          Ptr<MobilityModel> currPosition = curr->GetObject<MobilityModel> ();
          double currentRxPower = channel->GetRxPower (14, position, currPosition); // dBm

          // currentRxPower significa que o endDevice está mais próximo do currentGw
          // highestRxPower significa que o endDevice está mais próximo do bestGateway
          // entao o bestGateway passa a ser o currentGw
          if (currentRxPower > highestRxPower)
            {
              bestGateway = curr;
              bestGatewayPosition = curr->GetObject<MobilityModel> ();
              highestRxPower = currentRxPower;

              t_delay =
                  delay->GetDelay (position, bestGatewayPosition); // sendMobility,receiverMobility
              distance = position->GetDistanceFrom (bestGatewayPosition);
            }
        }

      // NS_LOG_DEBUG ("Rx Power: " << highestRxPower);
      double rxPower = highestRxPower;

      double snr = RxPowerToSNR (rxPower); // Snr da potencia do endDevices ao melhor gatewayH

      // Adicionando cneri para inserir no arquivo LorawanMacHelper::SetSpreadingFactorsUp
      Vector posEndDevices = position->GetPosition ();
      Vector posGW = bestGatewayPosition->GetPosition ();

      outputFile 
                << posEndDevices.x << ","  << posEndDevices.y << ","  << posEndDevices.z << "," 
                << posGW.x << ","  << posGW.y << ","  << posGW.z << "," 
                << dr << ","  << rxPower << ","  << distance << ","
                << t_delay.GetNanoSeconds () << ","  << snr << std::endl;

    } // end for EndDevices
}

#endif // FILE_H