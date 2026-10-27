/* Original classroom-news sting, synthesized locally; no external audio assets. */
window.BroadcastOpening=class {
  constructor(context,destination){this.context=context;this.source=null;this.timer=null;this.gain=context.createGain();this.gain.gain.value=.35;this.gain.connect(destination);this.gain.connect(context.destination);this.onstate=()=>{};this.ready=this.render();}
  async render(){const rate=44100,duration=5,offline=new OfflineAudioContext(2,rate*duration,rate),master=offline.createGain();master.gain.value=.62;master.connect(offline.destination);
    const tone=(frequency,at,length,level,type='sine')=>{const o=offline.createOscillator(),g=offline.createGain();o.type=type;o.frequency.setValueAtTime(frequency,at);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(level,at+.018);g.gain.exponentialRampToValueAtTime(.0001,at+length);o.connect(g);g.connect(master);o.start(at);o.stop(at+length+.02)};
    const whoosh=(at,length)=>{const b=offline.createBuffer(1,Math.ceil(rate*length),rate),d=b.getChannelData(0);let seed=937;for(let i=0;i<d.length;i++){seed=(seed*16807)%2147483647;d[i]=seed/1073741824-1}const s=offline.createBufferSource(),filter=offline.createBiquadFilter(),g=offline.createGain();s.buffer=b;filter.type='bandpass';filter.Q.value=.8;filter.frequency.setValueAtTime(350,at);filter.frequency.exponentialRampToValueAtTime(6000,at+length);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(.12,at+length*.55);g.gain.linearRampToValueAtTime(0,at+length);s.connect(filter);filter.connect(g);g.connect(master);s.start(at);s.stop(at+length)};
    whoosh(0,.65);
    const notes=[523.25,659.25,783.99,1046.5,783.99,880,987.77,1046.5];notes.forEach((n,i)=>{tone(n,.38+i*.23,.54,.16,'triangle');tone(n*2,.38+i*.23,.30,.035)});
    [130.81,164.81,196,261.63].forEach((n,i)=>tone(n,.45+i*.46,.8,.10,'sine'));
    for(const at of [.4,.86,1.32,1.78]){const o=offline.createOscillator(),g=offline.createGain();o.frequency.setValueAtTime(130,at);o.frequency.exponentialRampToValueAtTime(45,at+.16);g.gain.setValueAtTime(.24,at);g.gain.exponentialRampToValueAtTime(.0001,at+.22);o.connect(g);g.connect(master);o.start(at);o.stop(at+.24)}
    whoosh(2.08,.4);[523.25,659.25,783.99,1046.5].forEach(n=>tone(n,2.5,2.1,.095,'triangle'));tone(130.81,2.5,2,.16);tone(2093,2.52,1.2,.035);
    this.buffer=await offline.startRendering();return this.buffer;
  }
  setVolume(percent){this.gain.gain.setTargetAtTime(Math.min(100,Math.max(0,percent))/100,this.context.currentTime,.04)}
  play(){this.stop();if(!this.buffer||this.context.state!=='running')return false;const source=this.context.createBufferSource();source.buffer=this.buffer;source.connect(this.gain);this.source=source;this.onstate(true);source.onended=()=>{source.disconnect();if(this.source===source){this.source=null;this.onstate(false)}};source.start();return true}
  stop(){if(this.source){const old=this.source;this.source=null;try{old.stop()}catch{}old.disconnect()}this.onstate(false)}
};
