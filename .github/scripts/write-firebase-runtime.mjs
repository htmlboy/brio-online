import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const fields=['apiKey','authDomain','databaseURL','projectId','storageBucket','messagingSenderId','appId'];

export function runtimeConfigScript(raw){
  if(!raw)throw new Error('FIREBASE_CLIENT_CONFIG is required; the current deployment has not been replaced');
  let input;
  try{input=JSON.parse(raw)}catch{throw new Error('FIREBASE_CLIENT_CONFIG must be valid JSON')}
  if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Expected a Firebase browser configuration object');
  if(input.type==='service_account'||'private_key' in input||'privateKey' in input||'client_email' in input)throw new Error('Administrative credentials must not be deployed to a browser');
  const config={};
  for(const field of fields){
    if(typeof input[field]!=='string'||!input[field].trim())throw new Error('Missing Firebase client configuration field: '+field);
    config[field]=input[field];
  }
  if(!/^AIza[0-9A-Za-z_-]{35}$/.test(config.apiKey))throw new Error('Expected a Google API key in the apiKey field');
  return 'window.BRIO_FIREBASE_CONFIG = '+JSON.stringify(config).replace(/</g,'\\u003c')+';\n';
}

export async function writeRuntimeConfig(destination,raw){
  const script=runtimeConfigScript(raw);
  await mkdir(path.dirname(destination),{recursive:true});
  await writeFile(destination,script,{mode:0o644});
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const destination=process.argv[2];
  if(!destination)throw new Error('Provide the artifact configuration output path');
  await writeRuntimeConfig(destination,process.env.FIREBASE_CLIENT_CONFIG);
}
