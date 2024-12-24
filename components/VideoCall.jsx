"use client";

import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  LocalAudioTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import { useEffect, useRef } from "react";

function VideoCall({ appId, channelName, isMuted }) {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );
  const localAudioTrackRef = useRef(null);
  const localCameraTrackRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      await client.join(appId, channelName, null, null);
      localAudioTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack();
      localCameraTrackRef.current = await AgoraRTC.createCameraVideoTrack();
      await client.publish([localAudioTrackRef.current, localCameraTrackRef.current]);
    };

    init();

    return () => {
      client.leave();
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.close();
      }
      if (localCameraTrackRef.current) {
        localCameraTrackRef.current.close();
      }
    };
  }, [appId, channelName]);

  useEffect(() => {
    // Mute or unmute the local audio track
    if (localAudioTrackRef.current) {
      if (isMuted) {
        localAudioTrackRef.current.setEnabled(false);
      } else {
        localAudioTrackRef.current.setEnabled(true);
      }
    }
  }, [isMuted]);

  return (
    <AgoraRTCProvider client={client}>
      <Videos channelName={channelName} appId={appId} />
      <div className="fixed z-10 bottom-0 left-0 right-0 flex justify-center pb-4 space-x-4">
        <a
          className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
          href="/"
        >
          End Call
        </a>
      </div>
    </AgoraRTCProvider>
  );
}

function Videos({ channelName, appId }) {
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  usePublish([localMicrophoneTrack, localCameraTrack]);
  useJoin({
    appid: appId,
    channel: channelName,
    token: null,
  });

  audioTracks.map((track) => track.play());
  const deviceLoading = isLoadingMic || isLoadingCam;
  if (deviceLoading)
    return (
      <div className="flex flex-col items-center pt-40">Loading devices...</div>
    );
  const unit = "minmax(0, 1fr) ";

  return (
    <div className="flex flex-col justify-between w-full h-screen p-1">
      <div
        className={`grid  gap-1 flex-1`}
        style={{
          gridTemplateColumns:
            remoteUsers.length > 9
              ? unit.repeat(4)
              : remoteUsers.length > 4
              ? unit.repeat(3)
              : remoteUsers.length > 1
              ? unit.repeat(2)
              : unit,
        }}
      >
        <LocalVideoTrack
          track={localCameraTrack}
          play={true}
          className="w-full h-full"
        />
        {remoteUsers.map((user) => (
          <RemoteUser key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
}

export default VideoCall;