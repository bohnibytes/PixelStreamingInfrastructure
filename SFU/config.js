// Parse passed arguments
let passedPublicIP = null;
for(let arg of process.argv){
  if(arg && arg.startsWith("--PublicIP=")){
    let splitArr = arg.split("=");
    if(splitArr.length == 2){
      passedPublicIP = splitArr[1];
      console.log("--PublicIP=" + passedPublicIP);
    }
  }
}

const config = {
  // The URL of the signalling server to connect to
  signallingURL: "ws://localhost:8889",

  // The ID for this SFU to use. This will show up as a streamer ID on the signalling server
  SFUId: "SFU",

  // The ID of the streamer to subscribe to. If you leave this blank it will subscribe to the first streamer it sees.
  subscribeStreamerId: "DefaultStreamer",

  // Delay between list requests when looking for a specifc streamer.
  retrySubscribeDelaySecs: 10,

  // Enable SVC support
  enableSVC: true,

  mediasoup: {
    worker: {
      rtcMinPort: 40000,
      rtcMaxPort: 49999,
      logLevel: "debug",
      logTags: [
        "info",
        "ice",
        "dtls",
        "rtp",
        "srtp",
        "rtcp",
        "sctp"
        // 'rtx',
        // 'bwe',
        // 'score',
        // 'simulcast',
        // 'svc'
      ],
    },
    router: {
      mediaCodecs: [
        {
          kind: "audio",
          mimeType: "audio/opus",
          clockRate: 48000,
          channels: 2,
        },
        {
          kind: 'video',
          mimeType: 'video/VP8',
          clockRate: 90000,
          parameters: {}
        },
        {
          kind: "video",
          mimeType: "video/h264",
          clockRate: 90000,
          parameters: {
            "packetization-mode": 1,
            "profile-level-id": "42e01f",
            "level-asymmetry-allowed": 1
          },
        },
        
      ],
    },

    // here you must specify ip addresses to listen on
    // some browsers have issues with connecting to ICE on
    // localhost so you might have to specify a proper
    // private or public ip here.
    webRtcTransport: {
      listenIps: passedPublicIP != null ? [{ ip: "0.0.0.0", announcedIp: passedPublicIP}] : getLocalListenIps(), 
      // 100 megabits
      initialAvailableOutgoingBitrate: 100_000_000,
    },
  },
}

if(config.enableSVC)
{
  config.mediasoup.router.mediaCodecs.push(
  {
    kind: 'video',
    mimeType: 'video/VP9',
    clockRate: 90000,
    parameters: {
      "profile-id": 0
    }
  });
  config.mediasoup.router.mediaCodecs.push(
  {
    kind: 'video',
    mimeType: 'video/VP9',
    clockRate: 90000,
    parameters: {
      "profile-id": 2
    }
  });
}

function getLocalListenIps() {
  const listenIps = []
  if (typeof window === 'undefined') {
    const os = require('os')
    const networkInterfaces = os.networkInterfaces()
    const ips = []
    if (networkInterfaces) {
      for (const [key, addresses] of Object.entries(networkInterfaces)) {
        addresses.forEach(address => {
          if (address.family === 'IPv4') {
            listenIps.push({ ip: address.address, announcedIp: null })
          }
          /* ignore link-local and other special ipv6 addresses.
           * https://www.iana.org/assignments/ipv6-address-space/ipv6-address-space.xhtml
           */
          else if (address.family === 'IPv6' && address.address[0] !== 'f') {
            listenIps.push({ ip: address.address, announcedIp: null })
          }
        })
      }
    }
  }
  if (listenIps.length === 0) {
    listenIps.push({ ip: '127.0.0.1', announcedIp: null })
  }
  return listenIps
}

module.exports = config;
