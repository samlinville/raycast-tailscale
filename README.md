# Tailscale for Raycast
A Tailscale extension for Raycast that lets you quickly access the addresses of your Tailnet devices and copy them to the clipboard.

## How it works
This extension uses AppleScript to execute the common Tailscale command `tailscale status --json`, and parses the returned JSON object to list out the network devices in your Tailnet.

It does not collect any privileged login information.

## Screenshots
![tailscale-01](https://user-images.githubusercontent.com/3967272/161404616-126d0052-5d55-43fc-b090-50e2c87c4c63.png)
![tailscale-02](https://user-images.githubusercontent.com/3967272/161404619-b9ef32be-6071-44d4-8f17-436a5556a414.png)
![tailscale-03](https://user-images.githubusercontent.com/3967272/161404620-a05dd313-a2f9-47b7-af2c-daf370a4cdf7.png)
