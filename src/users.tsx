import {
  ActionPanel,
  Detail,
  List,
  Action,
  useNavigation,
  popToRoot,
  closeMainWindow,
  Color,
  Icon,
  showHUD,
  showToast,
  Toast,
  ToastStyle,
  Image,
} from "@raycast/api";
import React, { useEffect, useState } from "react";
import { execSync } from "child_process";

interface User {
  active: boolean;
  name: string;
}

function loadUsers(unparsedUsers: string[]) {
  const users: User[] = [];

  for (const unparsedUser: string of unparsedUsers) {
    const unparsedUserList: string[] = unparsedUser.split(" ");
    let user: User;

    if (unparsedUserList.length == 2) {
      user = {
        active: true,
        name: unparsedUserList[0],
      };
    } else if (unparsedUserList.length == 1) {
      user = {
        active: false,
        name: unparsedUserList[0],
      };
    }

    users.push(user);
  }
  console.log(users);
  return users;
}

function UserList() {
  const [users, setUsers] = useState<User[]>();
  useEffect(() => {
    async function fetch() {
      try {
        const ret = execSync("/Applications/Tailscale.app/Contents/MacOS/Tailscale switch --list").toString().trim();
        console.log(ret);
        const data: string[] = ret.split("\n");

        const _list = loadUsers(data);
        setUsers(_list);
      } catch (error) {
        console.log(error);
        showToast(Toast.Style.Failure, "Couldn't load users. Make sure Tailscale is connected.");
      }
    }
    fetch();
  }, []);

  return (
    <List isLoading={users === undefined}>
      {users?.map((user) => (
        <List.Item
          title={user.name}
          key={user.name}
          icon={
            user.active
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
          actions={
            <ActionPanel>
              <Action
                title="Switch to user"
                onAction={async () => {
                  const command = `/Applications/Tailscale.app/Contents/MacOS/Tailscale switch ${user.name}`;
                  console.log(command);
                  popToRoot();
                  closeMainWindow();
                  const ret = execSync(command).toString().trim();

                  if (ret.includes("Success") || ret.includes("Already")) {
                    showHUD(`Tailscale user switched to ${user.name}`);
                  } else {
                    showHUD(`Tailscale user failed to switch to ${user.name}`);
                  }
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

export default function Command() {
  return <UserList />;
}
