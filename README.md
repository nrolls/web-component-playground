# Whereby Web Component Playground

Demo project showing the Whereby web component for embedding Whereby's pre-built UI. 

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Usage

### Room Settings
The main interface contains a variety of available [Attributes/Parameters](https://docs.whereby.com/whereby-101/customizing-rooms/using-url-parameters) provided by Whereby to curate the end user experience. You can experiment with additional features by adjusting the `Settings` and `queryParamsMapping` in the RoomIframe component

### Whereby Commands

In order to use the various Whereby commands found in the project, you must make sure to add your domain/localhost to the list of "Allowed Domains" in the organzation settings for the Whereby room being used.

Open `https://yoursubdomain.whereby.com/org/settings/api` to adjust your [Allowed Domains](https://docs.whereby.com/whereby-101/faq-and-troubleshooting/allowed-domains-and-localhost) accordingly. It may take up to 10 minutes for the allowed domains to refresh in the Whereby backend.

Set "Bottom Toolbar" to off on the Room settings page and you can use the commands on the left panel to interact with the meeting room
