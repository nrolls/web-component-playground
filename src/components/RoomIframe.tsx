"use client";

import { forwardRef, useEffect } from "react";
import { mergeQuery } from "../util/urlUtils";

/** For a full description of these settings,
 * see: https://docs.whereby.com/customizing-rooms/using-url-parameters */
type Settings = {
  /** Turn off acoustic echo cancellation on audio */
  acousticEchoCancellation?: boolean;
  /** Turn off automatic gain control on audio */
  automaticGainControl?: boolean;
  /** Participant joins the room with microphone turned off */
  audio?: boolean;
  /** Enables/Disables the noise cancelation feature */
  audioDenoiser?: boolean;
  /** Automatically spotlight the local participant on room join */
  autoSpotlight?: boolean;
  /** Set the profile avatar of participant */
  avatarUrl?: string;
  /** Set `false` to hide the room background */
  background?: boolean;
  /** Show/hide the entire bottom toolbar */
  bottomToolbar?: boolean;
  /** Show/hide the breakout room feature for the meeting host */
  breakout?: boolean;
  /** Camera permissions are not requested or used at all */
  cameraAccess?: boolean;
  /** Show/hide the chat button */
  chat?: boolean;
  /** Set display name of participant */
  displayName?: string;
  /** A custom identifier for the participant */
  externalId?: string;
  /** Float the self view to the bottom right */
  floatSelf?: boolean;
  /** Predefine up to 20 groups for the breakout groups function */
  groups?: string[];
  /** Set the room UI language */
  language?: string;
  /** Show/hide the leave button */
  leaveButton?: boolean;
  /** Set `false` to hide the room lock button */
  locking?: boolean;
  /** Set `false` to hide the logo in the room header */
  logo?: boolean;
  /** Use a lower resolution by default */
  lowData?: boolean;
  /** Gets passed on to the corresponding webhooks */
  metadata?: string;
  /** Applies a minimal UI. Turns off all controls except for cam and mic */
  minimal?: boolean;
  /** Set `false` to hide the more button */
  moreButton?: boolean;
  /** Set `false` to hide the participant counter */
  participantCount?: boolean;
  /** Set `false` to hide the people button */
  people?: boolean;
  /** Set `false` to hide the Picture in Picture button */
  pictureInPictureButton?: boolean;
  /** Determines if users see the pre-call device and connectivity test */
  precallCeremony?: boolean;
  /** Adds functionality for participants to skip the connectivity test */
  precallCeremonyCanSkip?: boolean;
  /** Specify custom help link in pre-call review step */
  precallPermissionHelpLink?: string;
  /** Determines if users see the pre-call review step */
  precallReview?: boolean;
  /** Enables YouTube and Miro integrations in the meeting */
  roomIntegrations?: boolean;
  /** Show/hide the screenshare button */
  screenshare?: boolean;
  /** Set `false` to hide the settings button */
  settingsButton?: boolean;
  /** Skips the request permissions UI and asks for devices */
  skipMediaPermissionPrompt?: boolean;
  /** Enable name labels for participants in the subgrid */
  subgridLabels?: boolean;
  /** Show/hide the entire top toolbar */
  topToolbar?: boolean;
  /** Show/hide the meeting timer */
  timer?: boolean;
  /** Specify custom virtual background for the local participant */
  virtualBackgroundUrl?: string;
  /** Participant joins the room with camera turned off */
  video?: boolean;
};

function settingsToQueryParams(settings: Settings): Record<string, string> {
  const queryParamsMapping = {
    acousticEchoCancellation: "aec",
    automaticGainControl: "agc",
    audio: "audio",
    audioDenoiser: "audioDenoiser",
    autoSpotlight: "autoSpotlight",
    avatarUrl: "avatarUrl",
    background: "background",
    bottomToolbar: "bottomToolbar",
    breakout: "breakout",
    cameraAccess: "cameraAccess",
    chat: "chat",
    displayName: "displayName",
    externalId: "externalId",
    floatSelf: "floatSelf",
    groups: "groups",
    language: "lang",
    leaveButton: "leaveButton",
    locking: "locking",
    logo: "logo",
    lowData: "lowData",
    metadata: "metadata",
    minimal: "minimal",
    moreButton: "moreButton",
    participantCount: "participantCount",
    people: "people",
    pictureInPictureButton: "pipButton",
    precallCeremony: "precallCeremony",
    precallCeremonyCanSkip: "precallCeremonyCanSkip",
    precallPermissionHelpLink: "precallPermissionHelpLink",
    precallReview: "precallReview",
    roomIntegrations: "roomIntegrations",
    screenshare: "screenshare",
    settingsButton: "settingsButton",
    skipMediaPermissionPrompt: "skipMediaPermissionPrompt",
    subgridLabels: "subgridLabels",
    topToolbar: "topToolbar",
    timer: "timer",
    virtualBackgroundUrl: "virtualBackgroundUrl",
    video: "video",
  };

  const transformValue = (value: string | string[] | boolean) => {
    if (typeof value === "boolean") {
      return value ? "on" : "off";
    }
    if (Array.isArray(value)) {
      return value.join(",");
    }
    return value;
  };

  const mappedObject = Object.entries(settings).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      const queryKey = queryParamsMapping[key as keyof Settings];
      if (queryKey) {
        const queryValue = transformValue(value);

        acc[queryKey] = queryValue;
      }
      return acc;
    },
    {}
  );

  return mappedObject;
}

type EventPayloads = {
  ready: undefined;
  knock: undefined;
  participantupdate: { count: number };
  join: undefined;
  leave: { removed: boolean };
  participant_join: { participant: { metadata: string } };
  participant_leave: { participant: { metadata: string } };
  microphone_toggle: { enabled: boolean };
  camera_toggle: { enabled: boolean };
  chat_toggle: { open: boolean };
  pip_toggle: { open: boolean };
  deny_device_permission: { denied: boolean };
  screenshare_toggle: { enabled: boolean };
  streaming_status_change: { status: string };
  connection_status_change: { status: string };
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// Type guard for the WherebyEventData
function isWherebyEvent(eventData: unknown): eventData is WherebyEvent {
  const data = eventData; // Cast to the target type for property checks

  // Check if 'data' conforms to the WherebyEventData structure
  return (
    isObject(data) &&
    "type" in data &&
    typeof data.type === "string" &&
    "payload" in data
  );
}

// Type guards for each payload type
function isParticipantUpdatePayload(
  payload: unknown
): payload is EventPayloads["participantupdate"] {
  return (
    isObject(payload) &&
    isObject(payload.participantupdate) &&
    payload.participantupdate.count !== undefined
  );
}

function isLeavePayload(payload: unknown): payload is EventPayloads["leave"] {
  return isObject(payload) && payload.removed !== undefined;
}

function isParticipantPayload(
  payload: unknown
): payload is EventPayloads["participant_join" | "participant_leave"] {
  return (
    isObject(payload) &&
    isObject(payload.participant) &&
    payload.participant.metadata !== undefined
  );
}

function isEnabledPayload(
  payload: unknown
): payload is EventPayloads[
  | "microphone_toggle"
  | "camera_toggle"
  | "screenshare_toggle"] {
  return isObject(payload) && payload.enabled !== undefined;
}

function isOpenPayload(
  payload: unknown
): payload is EventPayloads["chat_toggle" | "pip_toggle"] {
  return isObject(payload) && payload.open !== undefined;
}

function isDenyDevicePermissionPayload(
  payload: unknown
): payload is EventPayloads["deny_device_permission"] {
  return isObject(payload) && payload.denied !== undefined;
}

function isStatusChangePayload(
  payload: unknown
): payload is EventPayloads[
  | "streaming_status_change"
  | "connection_status_change"] {
  return isObject(payload) && payload.status !== undefined;
}

type WherebyEvent = {
  type: keyof EventPayloads;
  payload: EventPayloads[WherebyEvent["type"]];
};

type Callbacks = {
  /**
   * Triggered when basic dependencies have loaded and the room is ready to be used.
   */
  onReady: () => void;

  /**
   * Triggered when the local user knocks to get into the room.
   */
  onKnock: () => void;

  /**
   * Triggered when a new participant joins or leaves.
   * @param detail - Contains the count of participants.
   */
  onParticipantUpdate: (detail: { count: number }) => void;

  /**
   * Triggered when the local user joins.
   */
  onJoin: () => void;

  /**
   * Triggered when the local user leaves.
   * @param detail - Contains the removal status.
   */
  onLeave: (detail: { removed: boolean }) => void;

  /**
   * Triggered when a new participant joins the room.
   * @param detail - Contains metadata of the participant.
   */
  onParticipantJoin: (detail: { participant: { metadata: string } }) => void;

  /**
   * Triggered when a participant leaves the room.
   * @param detail - Contains metadata of the participant.
   */
  onParticipantLeave: (detail: { participant: { metadata: string } }) => void;

  /**
   * Triggered when the local user toggles the microphone.
   * @param detail - Contains the enabled status.
   */
  onMicrophoneToggle: (detail: { enabled: boolean }) => void;

  /**
   * Triggered when the local user toggles the camera.
   * @param detail - Contains the enabled status.
   */
  onCameraToggle: (detail: { enabled: boolean }) => void;

  /**
   * Triggered when the local user toggles the chat.
   * @param detail - Contains the open status.
   */
  onChatToggle: (detail: { open: boolean }) => void;

  /**
   * Triggered when the local user toggles Picture-in-Picture mode.
   * @param detail - Contains the open status.
   */
  onPipToggle: (detail: { open: boolean }) => void;

  /**
   * Triggered when the local user denies permission to camera and microphone in the pre-call screen.
   * @param detail - Contains the denied status.
   */
  onDenyDevicePermission: (detail: { denied: boolean }) => void;

  /**
   * Triggered when the local user toggles the screenshare.
   * @param detail - Contains the enabled status.
   */
  onScreenshareToggle: (detail: { enabled: boolean }) => void;

  /**
   * Triggered when streaming status changes.
   * @param detail - Contains the current status.
   */
  onStreamingStatusChange: (detail: { status: string }) => void;

  /**
   * Triggered when user connection status changes.
   * @param detail - Contains the current connection status.
   */
  onConnectionStatusChange: (detail: { status: string }) => void;
};

type Props = {
  /** The base URL of the room */
  roomUrl: string;
  /** Settings for room customization (optional) */
  settings?: Settings;
  /** Callbacks for room events (optional) */
  callbacks?: Partial<Callbacks>;
  /** Class name to style the iframe (optional) */
  className?: string;
};

const RoomIframe = forwardRef(function RoomIframe(
  { roomUrl, settings, callbacks, className }: Props,
  ref: React.Ref<HTMLIFrameElement> | null
) {
  const queryParams = settings ? settingsToQueryParams(settings) : {};
  const url = mergeQuery(roomUrl, queryParams);
  const urlMatch =
    /https:\/\/([^.]+)(\.whereby.com|-ip-\d+-\d+-\d+-\d+.hereby.dev:4443)\/.+/.exec(
      url
    );

  if (!urlMatch) {
    throw new Error("Invalid Whereby room URL");
  }

  const [_, subdomain, domain] = urlMatch;
  const wherebyBaseUrl = `https://${subdomain}${domain}`;

  useEffect(() => {
    const handleMessage = (event: MessageEvent<unknown>) => {
      if (event.origin != wherebyBaseUrl) {
        return;
      }

      if (isWherebyEvent(event.data)) {
        const { type, payload } = event.data;

        switch (type) {
          case "ready":
            callbacks?.onReady?.();
            break;
          case "knock":
            callbacks?.onKnock?.();
            break;
          case "participantupdate":
            isParticipantUpdatePayload(payload) &&
              callbacks?.onParticipantUpdate?.(payload);
            break;
          case "join":
            callbacks?.onJoin?.();
            break;
          case "leave":
            isLeavePayload(payload) && callbacks?.onLeave?.(payload);
            break;
          case "participant_join":
            isParticipantPayload(payload) &&
              callbacks?.onParticipantJoin?.(payload);
            break;
          case "participant_leave":
            isParticipantPayload(payload) &&
              callbacks?.onParticipantLeave?.(payload);
            break;
          case "microphone_toggle":
            isEnabledPayload(payload) &&
              callbacks?.onMicrophoneToggle?.(payload);
            break;
          case "camera_toggle":
            isEnabledPayload(payload) && callbacks?.onCameraToggle?.(payload);
            break;
          case "chat_toggle":
            isOpenPayload(payload) && callbacks?.onChatToggle?.(payload);
            break;
          case "pip_toggle":
            isOpenPayload(payload) && callbacks?.onPipToggle?.(payload);
            break;
          case "deny_device_permission":
            isDenyDevicePermissionPayload(payload) &&
              callbacks?.onDenyDevicePermission?.(payload);
            break;
          case "screenshare_toggle":
            isEnabledPayload(payload) &&
              callbacks?.onScreenshareToggle?.(payload);
            break;
          case "streaming_status_change":
            isStatusChangePayload(payload) &&
              callbacks?.onStreamingStatusChange?.(payload);
            break;
          case "connection_status_change":
            isStatusChangePayload(payload) &&
              callbacks?.onConnectionStatusChange?.(payload);
            break;
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [callbacks, wherebyBaseUrl]);

  return (
    <iframe
      ref={ref}
      title="Whereby iframe embed"
      className={className}
      src={url}
      allow="camera; microphone; fullscreen; speaker; display-capture; compute-pressure"
    ></iframe>
  );
});

export default RoomIframe;
export type { Settings, Callbacks };
