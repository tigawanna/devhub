import React from 'react'
import { Mutationprops, RequiredNewPostFormFields } from './types';
import { PBUser } from '../../utils/types/types';
import { TheIcon } from './../../shared/wrappers/TheIcon';
import { BiImageAdd } from 'react-icons/bi'
import { LoaderElipse } from '../../shared/loaders/Loaders';
import { UseMutationResult } from '@tanstack/react-query';


interface PlainFormProps {
    user:PBUser;
    mutation: UseMutationResult<void, any, Mutationprops, unknown>
    error: {
        name: string;
        message: string;
    };
    setError: React.Dispatch<React.SetStateAction<{
        name: string;
        message: string;
    }>>

}

export const PlainForm = ({user,error,setError}:PlainFormProps) => {
const [input, setInput] = React.useState<RequiredNewPostFormFields>({
  user:user?.id as string ,
  body:'',
  media:undefined,
})
const [pic, setPic] = React.useState<File | string | null>();
const fileInput = React.useRef<HTMLInputElement | null>(null);

const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>)=>{
    if ('files' in e.target && e.target.files) {
        setPic(e.target.files[0]);
        // @ts-expect-error
        setInput((prev)=>{ return {...prev,media:e.target.files[0]}})
    }
    
    setInput((prev)=>{return{...prev,[e.target.id]:e.target.value}})
}

const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>)=>{
e.preventDefault()
console.log("submitting .... ",input)
}
const isError = (err: typeof error, label: keyof RequiredNewPostFormFields) => {
    if (err.name === label && err.message !=="") {
        return true;
        }
    return false;
};

const disableButton=(vals:typeof input)=>{
    console.log("input === ",input)
if(vals.body !=="" || vals.media) {
    return false
}
return true
}

return (
<div className='w-full h-fit max-h-[90%] flex flex-col items-center justify-center bg-black rounded-xl'>
<form 
onSubmit={handleSubmit}
className='w-full h-full flex flex-col items-center justify-center'>


<div className="w-full h-full flex flex-col items-center justify-center ">
{/* <input className="hidden" {...register('user')}/> */}
{/* file input will be hidden and the iage icon will forwad the click event via a ref */}
<input className="hidden" ref={fileInput} type="file" onChange={handleChange} />


<textarea
    id="body"
    style={{ borderColor: isError(error, "body") ? "red" : "" }}
    className="w-[95%] min-h-[100px] md:h-[30%]
    m-2 p-2  border border-black dark:border-white text-base rounded-lg
    dark:bg-slate-700focus:border-2 dark:focus:border-4 focus:border-purple-700
    dark:focus:border-purple-600 "
    onChange={handleChange}
    placeholder="What's on your mind"
    />
    
    {(pic && typeof pic === 'object') ? <img src={URL.createObjectURL(pic as Blob)}
            className="max-h-[200px]  rounded-lg" /> : null}
    {(pic && typeof pic === 'string') ? <img src={pic}
                    className="w-[80%] max-h-[300px] rounded-lg" /> : null}
    <div className="w-[90%]">
        <TheIcon Icon={BiImageAdd} size={'30'} iconAction={() => fileInput.current?.click()} />
    </div>
    {/* <FormButton form_stuff={form_stuff} /> */}
    <PlainFormButton 
    disabled={disableButton(input)}
    isSubmitting={false}
    label={"Post"}
    />

    </div>
 </form>
</div>
);
}



interface PlainFormButtonProps {
isSubmitting:boolean
disabled:boolean
label?:string
}

export const PlainFormButton = ({disabled,isSubmitting,label="Subimt"}:PlainFormButtonProps) => {
    console.log("disable buyyon ??",disabled)
return (
    <button
        type="submit"
        disabled={disabled}
        style={{opacity:disabled?'20%':'100%'}}
        className="p-2 w-[60%] md:w-[30%]
            border-2 dark:border border-slate-700 dark:border-slate-400 dark:bg-slate-800
            flex items-center justify-center m-2 rounded-lg 
            hover:shadow-slate-900 dark:hover:shadow-slate-50 
            hover:shadow-lg dark:hover:shadow
            hover:scale-105"
    >
        {isSubmitting ? (
            <div className="flex justify-center items-center">
                <LoaderElipse />
            </div>
        ) : (
        <div 
        // style={{backgroundColor:"ButtonHighlight"}}
        className="text-lg font-bold dark:font-normal ">{label}</div>
        )}
    </button>
);
}
