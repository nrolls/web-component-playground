import { type RefObject, useCallback } from "react";

function postCommand(
  iframeRef: RefObject<HTMLIFrameElement> | null,
  command: string,
  args: boolean[] = [],
) {
  const iframe = iframeRef?.current;

  if (iframe?.contentWindow && iframe?.src) {
    const origin = new URL(iframe.src).origin;

    //FIXME: This is not currently working :(
    iframe.contentWindow.postMessage({ command, args }, origin);
  }
}

export default function useWherebyRoomIframeCommands(
  iframeRef: RefObject<HTMLIFrameElement> | null,
) {
  const startRecording = useCallback(() => {
    postCommand(iframeRef, "start_recording");
  }, [iframeRef]);

  const stopRecording = useCallback(() => {
    postCommand(iframeRef, "stop_recording");
  }, [iframeRef]);

  const startStreaming = useCallback(() => {
    postCommand(iframeRef, "start_streaming");
  }, [iframeRef]);

  const stopStreaming = useCallback(() => {
    postCommand(iframeRef, "stop_streaming");
  }, [iframeRef]);

  const toggleCamera = useCallback(
    (enabled: boolean) => {
      postCommand(iframeRef, "toggle_camera", [enabled]);
    },
    [iframeRef],
  );
  const toggleMicrophone = useCallback(
    (enabled: boolean) => {
      postCommand(iframeRef, "toggle_microphone", [enabled]);
    },
    [iframeRef],
  );

  const toggleScreenshare = useCallback(
    (enabled: boolean) => {
      postCommand(iframeRef, "toggle_screenshare", [enabled]);
    },
    [iframeRef],
  );

  const toggleChat = useCallback(
    (enabled: boolean) => {
      postCommand(iframeRef, "toggle_chat", [enabled]);
    },
    [iframeRef],
  );
  const toggleBreakout = useCallback(
    (enabled: boolean) => {
      postCommand(iframeRef, "toggle_breakout", [enabled]);
    },
    [iframeRef],
  );
  const leaveRoom = useCallback(
    (enabled: boolean) => {
      postCommand(iframeRef, "leave_room", [enabled]);
    },
    [iframeRef],
  );
  const togglePeople = useCallback(
    (enabled: boolean) => {
      postCommand(iframeRef, "toggle_people", [enabled]);
    },
    [iframeRef],
  );

  return {
    startRecording,
    stopRecording,
    startStreaming,
    stopStreaming,
    toggleCamera,
    toggleMicrophone,
    toggleScreenshare,
    toggleChat,
    toggleBreakout,
    togglePeople,
    leaveRoom,
  };
}
