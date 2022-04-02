import { ActionPanel, Detail, List, Action } from "@raycast/api";
import { runAppleScriptSync } from "run-applescript";

export default function Command() {

  let listArr: Array<any> = [];
  for (const [key, value] of Object.entries(list.Peer)) {
    listArr.push(value);
  }

  return (
    <List>
      <List.Item
        icon="list-icon.png"
        title="Greeting"
        actions={
          <ActionPanel>
            <Action.Push title="Show Details" target={<Detail markdown={listArr[1].DNSName} />} />
          </ActionPanel>
        }
      />
      <List.Item
        icon="list-icon.png"
        title="Heyo"
        actions={
          <ActionPanel>
            <Action.Push title="Heyo" target={<Detail markdown="# Hey! 👋" />} />
          </ActionPanel>
        }
      />
    </List>
  );
}
