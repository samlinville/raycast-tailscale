import {
  ActionPanel,
  Detail,
  List,
  Action,
  useNavigation,
  Color,
  Icon,
  showToast,
  popToRoot,
  closeMainWindow,
  Toast,
  Image,
} from "@raycast/api";
import { FormValueModel } from "@raycast/api/types/api/internal";
import React, { useEffect, useState } from "react";
import { execSync } from "child_process";
import { LooseObject, loadDevices } from "./shared.tsx";

function loadExitNodes(self: LooseObject, data: LooseObject) {
  const devices = loadDevices(self, data);

  return devices.filter((element, index, array) => {
    return element.exitnodeoption;
  });
}

function isExitNodeActive(devices: Devices[]) {
  for (const device of devices) {
    if (device.exitnode) {
      return true;
    }
  }

  return false;
}

function setExitNode(host: string, allowLAN: boolean) {
  if (host === "Turn off exit node") {
    host = "";
  }

  const command = `/Applications/Tailscale.app/Contents/MacOS/Tailscale set --exit-node "${host}"`;
  console.log(command);
  popToRoot();
  closeMainWindow();
  execSync(command).toString().trim();

  if (allowLAN) {
    execSync("/Applications/Tailscale.app/Contents/MacOS/Tailscale set --exit-node-allow-lan-access").toString().trim();
  }
}

function ExitNodeList() {
  const [exitNodes, setExitNodes] = useState<ExitNode[]>();
  useEffect(() => {
    async function fetch() {
      try {
        const ret = execSync("/Applications/Tailscale.app/Contents/MacOS/Tailscale status --json").toString().trim();
        const data: LooseObject = JSON.parse(ret);

        if (!data.Self.Online) {
          throw "Tailscale not connected";
        }

        const _list = loadExitNodes(data.Self, data.Peer);

        if (isExitNodeActive(_list)) {
          const disable = {
            self: false,
            key: 9001,
            name: "Turn off exit node",
            ipv4: "",
            os: "",
            online: true,
            lastseen: new Date(),
            exitnode: true,
            exitnodeoption: false,
          };

          _list.unshift(disable);
        }

        setExitNodes(_list);
      } catch (error) {
        showToast(Toast.Style.Failure, "Couldn't load exitNodes. Make sure Tailscale is connected.");
      }
    }
    fetch();
  }, []);

  return (
    <List isLoading={exitNodes === undefined}>
      {exitNodes?.map((exitNode) => (
        <List.Item
          title={exitNode.name}
          subtitle={exitNode.ipv4 + "    " + exitNode.os}
          key={exitNode.key}
          icon={
            exitNode.online
              ? {
                  source: {
                    light: "connected_light.png",
                    dark: "connected_dark.png",
                  },
                  mask: Image.Mask.Circle,
                }
              : {
                  source: {
                    light: "lastseen_light.png",
                    dark: "lastseen_dark.png",
                  },
                  mask: Image.Mask.Circle,
                }
          }
          accessories={[
            {
              text: exitNode.exitnode ? `        Connected` : "",
            },
          ]}
          actions={
            <ActionPanel>
              <Action title="Use as exit node" onAction={() => setExitNode(exitNode.name, false)} />
              <Action title="Use as exit node and allow LAN access" onAction={() => setExitNode(exitNode.name, true)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

export default function Command() {
  return <ExitNodeList />;
}
