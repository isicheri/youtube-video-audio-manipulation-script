import ytdl from "@distube/ytdl-core";
import fs from "fs"
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfmpegPath("C:\Users\OWNER\Downloads\ffmpeg-7.1-essentials_build\ffmpeg-7.1-essentials_build\bin\ffmpeg.exe");

const downloadVideo = async (url:string,fmt="mp4") => {
   try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    console.log('Downloading:' + title);
   const filePath = `${title}.${fmt}`;
   const fileStream = fs.createWriteStream(filePath);
   ytdl(url).pipe(fileStream);
   fileStream.on("finish",() => {
    console.log("download sucessfully")
   })
   } catch (error) {
    console.log("error:",error)
   }
}

const downloadAudio = async (url:string,fmt='mp3') => {
    try {
       const info = await ytdl.getBasicInfo(url);
       const title = info.videoDetails.title;
    console.log('Downloading:' + title);
    const filePath = `${title}.${fmt}`;
    const fileStream = fs.createWriteStream(filePath);
    ytdl(url,{filter: "audioonly"}).pipe(fileStream)
    fileStream.on("finish",() => {
        console.log("download sucessful")
    })
    } catch (error) {
    console.log("error:",error)
    }
}

const downloadAudioAndManipulate = async(url:string,fmt:string,startTime:any,duration:any) => {
    try {
        const info = await ytdl.getBasicInfo(url);
        const title = info.videoDetails.title;
     console.log('Downloading:' + title);
     const filePath = `${title}.${fmt}`;
     ffmpeg()
     .input(ytdl(url,{filter:"audioonly"}))//get your audio stream
     .audioCodec('libmp3lame') //set audio codec to MP3
     .audioBitrate(192)// set the bitrate
     .setStartTime(startTime) // Set the start time for audio extracton
     .setDuration(duration)
     .audioFilters('volume=2.0') //this sets the volume
     .output(filePath)
     .on('start',(cl) => {console.log('ffmpeg process started:',cl)})
     .on('progress',(progress) => {console.log(`processing:${progress.percent}`)})
     .on('end',() => {console.log(`ffmpeg process started:${filePath}`)})
     .on("error",(err) => {console.log(`error during the process:`,err)})
     .run()

     } catch (error) {
     console.log("error:",error)
     }
} 

//got the idea from an upwork project to manipulate audio to download a specific time frame(starting time frame and ending time frame)

//also change the url to the video you want to use 
const url = "https://youtu.be/A3Q_KXySvCY?si=mt3fRqNSQ1zOqhfa";



//uncomment the function you wish to use 
// downloadVideo(url);
// downloadAudio(url);
downloadAudioAndManipulate(url,'mp3',"00:02:00","00:04:30")

// console.log()