import { ActionPanel, Detail, List, Action, useNavigation, Icon, showToast, Toast } from "@raycast/api";
import React, { useEffect, useState } from "react";
import { runAppleScript } from "run-applescript";

interface Device {
  key: number;
  name: string;
  dns: string;
  ipv4: string;
  ipv6: string;
  os: string;
  online: boolean;
}

interface LooseObject {
  [key: string]: any
}


function loadDevices(data: LooseObject) {
  console.log('heyo');
  const devices: Device[] = [];
  let theKey = 0;
  for (const [key, value] of Object.entries(data)) {
    console.log(value.HostName);
    const device = {
      key: ++theKey, 
      name: value.HostName,
      dns: value.DNSName,
      ipv4: value.TailscaleIPs[0],
      ipv6: value.TailscaleIPs[1],
      os: value.OS,
      online: value.Online,
    }
    devices.push(device);
  }
  console.log('Im running!')
  return devices;
}

function DeviceList() {
  const [devices, setDevices] = useState<Device[]>();
  useEffect(() => {
    async function fetch() {
      try {
        const ret = await runAppleScript('do shell script "/Applications/Tailscale.app/Contents/MacOS/Tailscale status --json"');
        const data: LooseObject = JSON.parse(ret);
        console.log('successfully got the data object from tailscale')
        const _list = loadDevices(data.Peer);
        console.log(_list);
        setDevices(_list);
      } catch (error) {
        showToast(Toast.Style.Failure, "Couldn't load devices. Make sure Tailscale is connected.");
      }
    }
    fetch();
  }, []);

  return (
    <List isLoading={devices === undefined}>
      {devices?.map((device) => (
        <List.Item
          title={device.name}
          key={device.key}
          actions={
            <ActionPanel>
              <Action.Push title="Heyo" target={<Detail markdown="# Hey! 👋" />} />
            </ActionPanel>
          }
          />
      ))}  
    </List>
  );
}

export default function Command() {


  return (
    <DeviceList />
  );
}
