import { useRef, useState } from "react";
import RoomIframe, {
  type Callbacks,
  type Settings,
} from "./components/RoomIframe";
import useWherebyRoomIframeCommands from "./hooks/useWherebyRoomIframeCommands";

// In order to preload this with a specific room URL, you can add roomUrl as a query param
// Example: <route_to_page>roomUrl=my-room.whereby.com
function WherebySandbox() {
  const [roomUrl, setRoomUrl] = useState("");

  const [eventLog, setEventLog] = useState<string[]>([]);

  const appendEventLog = (message: string, detail?: object) => {
    const messageWithDetail = detail
      ? `${message} ${JSON.stringify(detail)}`
      : message;
    setEventLog((prevLog) => [...prevLog, messageWithDetail]);
    console.log(message, detail);
  };

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const {
    startRecording,
    stopRecording,
    startStreaming,
    stopStreaming,
    toggleCamera,
    toggleMicrophone,
    toggleScreenshare,
    toggleChat,
  } = useWherebyRoomIframeCommands(iframeRef);

  const [camera, setCamera] = useState(false);
  const [microphone, setMicrophone] = useState(false);
  const [screenshare, setScreenshare] = useState(false);
  const [chat, setChat] = useState(false);

  const [meetingJoined, setMeetingJoined] = useState(false);
  const [settings, setSettings] = useState<Partial<Settings>>({});

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;

    console.log({ name, value, type });
    if (type === "select-one") {
      const boolValue = value === "undefined" ? undefined : value === "true";
      setSettings((prev) => ({ ...prev, [name]: boolValue }));
      console.log({ name, type, value, boolValue });
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }));
    }
  };

  const optionToLabel = (option: string) =>
    option.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  const checkboxOptions = [
    [
      "acousticEchoCancellation",
      "Turn off acoustic echo cancellation on audio",
    ],
    ["automaticGainControl", "Turn off automatic gain control on audio"],
    ["audio", "Participant joins the room with microphone turned off"],
    ["audioDenoiser", "Enables/Disables the noise cancelation feature"],
    [
      "autoSpotlight",
      "Automatically spotlight the local participant on room join",
    ],
    ["background", "Set `false` to hide the room background"],
    ["bottomToolbar", "Show/hide the entire bottom toolbar"],
    ["breakout", "Show/hide the breakout room feature for the meeting host"],
    ["cameraAccess", "Camera permissions are not requested or used at all"],
    ["chat", "Show/hide the chat button"],
    ["floatSelf", "Float the self view to the bottom right"],
    ["leaveButton", "Show/hide the leave button"],
    ["locking", "Set `false` to hide the room lock button"],
    ["logo", "Set `false` to hide the logo in the room header"],
    ["lowData", "Use a lower resolution by default"],
    [
      "minimal",
      "Applies a minimal UI. Turns off all controls except for cam and mic",
    ],
    ["moreButton", "Set `false` to hide the more button"],
    ["participantCount", "Set `false` to hide the participant counter"],
    ["people", "Set `false` to hide the people button"],
    [
      "pictureInPictureButton",
      "Set `false` to hide the Picture in Picture button",
    ],
    [
      "precallCeremony",
      "Determines if users see the pre-call device and connectivity test",
    ],
    [
      "precallCeremonyCanSkip",
      "Adds functionality for participants to skip the connectivity test",
    ],
    ["precallReview", "Determines if users see the pre-call review step"],
    [
      "roomIntegrations",
      "Enables YouTube and Miro integrations in the meeting",
    ],
    ["screenshare", "Show/hide the screenshare button"],
    ["settingsButton", "Set `false` to hide the settings button"],
    [
      "skipMediaPermissionPrompt",
      "Skips the request permissions UI and asks for devices",
    ],
    ["subgridLabels", "Enable name labels for participants in the subgrid"],
    ["topToolbar", "Show/hide the entire top toolbar"],
    ["timer", "Show/hide the meeting timer"],
    ["video", "Participant joins the room with camera turned off"],
  ];

  const checkboxOptionInputs = checkboxOptions.map(([option, description]) => {
    const label = optionToLabel(option!);

    return (
      <label className="flex items-center" title={description} key={option}>
        <select
          className="mr-2"
          name={option}
          value={(settings[option as keyof Settings] ?? "").toString()}
          onChange={handleInputChange}
        >
          <option value={"undefined"}></option>
          <option value="true">on </option>
          <option value="false">off</option>
        </select>
        {label}
      </label>
    );
  });

  const textOptions = [
    ["avatarUrl", "Set the profile avatar of participant"],
    ["displayName", "Set display name of participant"],
    ["externalId", "A custom identifier for the participant"],
    ["language", "Set the room UI language"],
    ["metadata", "Gets passed on to the corresponding webhooks"],
    [
      "precallPermissionHelpLink",
      "Specify custom help link in pre-call review step",
    ],
    [
      "virtualBackgroundUrl",
      "Specify custom virtual background for the local participant",
    ],
  ];

  const textOptionInputs = textOptions.map(([option, description]) => {
    const label = optionToLabel(option!);

    return (
      <input
        type="text"
        title={description}
        className="rounded border p-2"
        name={option}
        placeholder={label}
        value={(settings[option as keyof Settings] ?? "").toString()}
        onChange={handleInputChange}
        key={option}
      />
    );
  });

  const callbacks: Callbacks = {
    onReady: () => {
      appendEventLog("onReady called");
    },
    onKnock: () => {
      appendEventLog("onKnock called");
    },
    onParticipantUpdate: (detail) => {
      appendEventLog("onParticipantUpdate called with", detail);
    },
    onJoin: () => {
      appendEventLog("onJoin called");
    },
    onLeave: (detail) => {
      appendEventLog("onLeave called with", detail);
      setMeetingJoined(false);
    },
    onParticipantJoin: (detail) => {
      appendEventLog("onParticipantJoin called with", detail);
    },
    onParticipantLeave: (detail) => {
      appendEventLog("onParticipantLeave called with", detail);
    },
    onMicrophoneToggle: (detail) => {
      appendEventLog("onMicrophoneToggle called with", detail);
    },
    onCameraToggle: (detail) => {
      appendEventLog("onCameraToggle called with", detail);
    },
    onChatToggle: (detail) => {
      appendEventLog("onChatToggle called with", detail);
    },
    onPipToggle: (detail) => {
      appendEventLog("onPipToggle called with", detail);
    },
    onDenyDevicePermission: (detail) => {
      appendEventLog("onDenyDevicePermission called with", detail);
    },
    onScreenshareToggle: (detail) => {
      appendEventLog("onScreenshareToggle called with", detail);
    },
    onStreamingStatusChange: (detail) => {
      appendEventLog("onStreamingStatusChange called with", detail);
    },
    onConnectionStatusChange: (detail) => {
      appendEventLog("onConnectionStatusChange called with", detail);
    },
  };

  if (meetingJoined) {
    return (
      <div className="flex h-screen w-screen flex-row">
        <div className="flex flex-col">
          <button
            className="m-3 rounded border border-slate-700 bg-cyan-100 px-3 py-2"
            onClick={() => startRecording()}
          >
            startRecording
          </button>
          <button
            className="m-3 rounded border border-slate-700 bg-cyan-100 px-3 py-2"
            onClick={() => stopRecording()}
          >
            stopRecording
          </button>
          <button
            className="m-3 rounded border border-slate-700 bg-cyan-100 px-3 py-2"
            onClick={() => startStreaming()}
          >
            startStreaming
          </button>
          <button
            className="m-3 rounded border border-slate-700 bg-cyan-100 px-3 py-2"
            onClick={() => stopStreaming()}
          >
            stopStreaming
          </button>
          <button
            className="m-3 rounded border border-slate-700 bg-cyan-100 px-3 py-2"
            onClick={() => {
              toggleCamera(camera);
              setCamera(!camera);
            }}
          >
            toggleCamera
          </button>
          <button
            className="m-3 rounded border border-slate-700 bg-cyan-100 px-3 py-2"
            onClick={() => {
              toggleMicrophone(microphone);
              setMicrophone(!microphone);
            }}
          >
            toggleMicrophone
          </button>
          <button
            className="m-3 rounded border border-slate-700 bg-cyan-100 px-3 py-2"
            onClick={() => {
              toggleScreenshare(screenshare);
              setScreenshare(!screenshare);
            }}
          >
            toggleScreenshare
          </button>
          <button
            className="m-3 rounded border border-slate-700 bg-cyan-100 px-3 py-2"
            onClick={() => {
              toggleChat(chat);
              setChat(!chat);
            }}
          >
            toggleChat
          </button>
        </div>
        <RoomIframe
          ref={iframeRef}
          className="h-full w-full"
          roomUrl={roomUrl}
          settings={settings}
          callbacks={callbacks}
        />
        <div className="mx-2 mt-1 flex w-fit flex-col overflow-auto">
          <ol className="child flex flex-col gap-1">
            {eventLog.map((event, index) => (
              <li
                key={index}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
              >
                <span className="text-gray-500">{index + 1}:</span> {event}
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-1 p-6">
        <h1 className="text-2xl">Room Settings</h1>
        <hr />
        <div className="mb-8 mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4 2xl:grid-cols-6">
          {checkboxOptionInputs}
        </div>
        <div className="mb-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {textOptionInputs}

          <input
            type="text"
            title="Predefine up to 20 groups for the breakout groups function"
            className="rounded border p-2"
            name="groups"
            placeholder="Groups (comma separated)"
            value={settings.groups?.join(",") ?? ""}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                groups: e.target.value.split(","),
              }))
            }
          />
        </div>

        <input
          type="text"
          title="URL of the whereby room. Can contain query params"
          className="rounded border p-2"
          value={roomUrl}
          placeholder="Room URL"
          onChange={(e) => setRoomUrl(e.target.value)}
        />
        <button
          className="col-span-2 col-start-2 min-w-fit  rounded bg-blue-500 p-2 text-white"
          onClick={() => {
            setMeetingJoined(true);
          }}
        >
          Join Room
        </button>
      </div>
    );
  }
}

export default WherebySandbox;
