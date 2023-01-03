import React from "react";
import { useNavigate } from 'react-router-dom';
import { PBUser } from "../../utils/types/types";
import { providers } from "../../utils/pb/config";
import { TheIcon } from '@denniskinuthia/tiny-pkgs';
import { FaGithub,FaGoogle } from 'react-icons/fa'

interface OAuthLoginProps {
user?: PBUser
}
interface ProvType{
    name: string
    state: string
    codeVerifier: string
    codeChallenge: string
    codeChallengeMethod: string
    authUrl: string
}

export const OAuthLogin: React.FC<OAuthLoginProps> = ({user}) => {

const provs = providers.authProviders;
const navigate = useNavigate()
// console.log("user in Login.tsx  ==  ",user)
if(user?.email){
  navigate('/')
}
const startLogin = (prov:ProvType) => {
   localStorage.setItem("provider",JSON.stringify(prov));
  const redirectUrl = "http://localhost:3000/redirect";
  const url = prov.authUrl + redirectUrl;
      // console.log("prov in button === ", prov)
      // console.log("combined url ==== >>>>>>  ",url)
  
    if (typeof window !== "undefined") {
      window.location.href = url;
    }
  };
const providerIcons={
github:FaGithub,
google:FaGoogle
}
  
  return (
    <div className="w-full h-full flex flex-wrap items-center justify-center gap-2 ">

      {provs &&
        provs?.map((item:any) => {
          return (
            <div
              key={item.name}
              onClick={() => startLogin(item)} 
              className="p-2 w-[60%] md:w-[30%] cursor-pointer
              border-2 border-purple-600 rounded-lg hover:border-purple-800 
             capitalize text-xl font-bold flex items-center justify-center gap-2"
            >
            <TheIcon
            iconstyle="" 
            Icon={providerIcons[item.name as keyof typeof providerIcons]}
            
            size={'50'}
            />
              {item.name}
            </div>
          );
        })}
    </div>
  );
};
