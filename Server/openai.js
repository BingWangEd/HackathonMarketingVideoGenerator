import OpenAI from 'openai';

const openai = new OpenAI();

let video = await openai.videos.create({
    model: 'sora-2',
    prompt: "Open a Christmas gift box and reveal this ring",
    
});

console.log('Video generation started: ', video);
