import React from "react";

import { PBUser } from "../../utils/types/types";
import { TheIcon } from "../../shared/wrappers/TheIcon";
import { BiImageAdd } from "react-icons/bi";
import { UseMutationResult } from "@tanstack/react-query";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { concatErrors } from "../../utils/utils";
import { Record } from "pocketbase";
import { PlainFormButton } from '../form/FormButton';
import { Mutationprops, RequiredNewPostFormFields } from "../../utils/types/form";

interface PlainFormProps {
    user: PBUser;
    mutation: UseMutationResult<Record, unknown, Mutationprops, unknown>;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    label: string;
}

export const PostForm = ({ label, user, mutation, setIsOpen }: PlainFormProps) => {
    const [error, setError] = React.useState({ name: "", message: "" });
    const [input, setInput] = React.useState<RequiredNewPostFormFields>({
        user: user?.id as string,
        body: "",
        media: undefined
    });
    const [pic, setPic] = React.useState<File | string | null>();

    const fileInput = React.useRef<HTMLInputElement | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if ("files" in e.target && e.target.files) {
            setPic(e.target.files[0]);
            // @ts-expect-error
            setInput(prev => { return { ...prev, media: e.target.files[0] };
            });
        }

        setInput(prev => {
            return { ...prev, [e.target.id]: e.target.value };
        });
        if (error.message !== "" || error.name !== "") {
            setError({ name: "", message: "" });
        }
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        // //no-console("submitting .... ",input)

        if (input.user) {
            if ((input?.media && "name" in input?.media) || input.body !== "") {
                const formdata = new FormData();
                if (input?.media && "name" in input?.media) {
                    formdata.append("media", input?.media);
                }
                if (input.body !== "") {
                    formdata.append("body", input.body as string);
                }
                formdata.append("user", input.user);

                mutation.mutate(
                    { basepayload: formdata },
                    {
                        onSuccess: () => {
                            setIsOpen(false);
                        },
                        onSettled: () => {
                            setPic(null);
                            setInput(prev => {
                                return { ...prev, body:"",media: undefined };
                            });
                        },
                        onError: (err: any) => {
                            // //no-console("errror adding new post in ", err.data);
                            setError({
                                name: "main",
                                message: concatErrors(err)
                            });
                        }
                    }
                );
            } else {
                setError({ name: "main", message: "either body or image is required" });
            }
        }
    };
    const isError = (err: typeof error, label: keyof RequiredNewPostFormFields) => {
        if (err.name === label && err.message !== "") {
            return true;
        }
        return false;
    };

    const disableButton = (vals: typeof input) => {
        // //no-console("input === ",input)
        if (vals.body !== "" || vals.media) {
            return false;
        }
        return true;
    };

    const clearImage = () => {
        setPic(null);
        setInput(prev => {
            return { ...prev, media: undefined };
        });
        if (error.message !== "" || error.name !== "") {
            setError({ name: "", message: "" });
        }
    };

    return (
        <div
            className="w-full h-fit max-h-[90%] flex flex-col items-center justify-center 
             rounded-xl "
        >
   
            <form
                onSubmit={handleSubmit}
                className="w-full md:w-[60%] h-full border-2 shadow-xl rounded-xl p-3
                flex flex-col items-center justify-center bg-white dark:bg-black dark:text-white"
            >
                <div className="w-[95%]  text-xl font-bold">
                    {label}
                </div>
                <div className="w-full  h-full flex flex-col items-center justify-center ">
                    {/* <input className="hidden" {...register('user')}/> */}
                    {/* file input will be hidden and the iage icon will forwad the click event via a ref */}
                    <input className="hidden" ref={fileInput} type="file" onChange={handleChange} />

                    <textarea
                        id="body"
                        style={{ borderColor: isError(error, "body") ? "red" : "" }}
                        className="w-[95%] min-h-[50px] md:h-[30%]
                        m-2 p-2  text-base rounded-lg
                        dark:bg-slate-700focus:border-2 dark:focus:border-4 focus:border-purple-700
                        dark:focus:border-purple-600 bg-white dark:bg-black "
                        onChange={handleChange}
                        autoFocus={true}
                        placeholder={label==="reply"?"add to the conversation":"What's on your mind"}
                    />

                    {pic && typeof pic === "object" ? (
                        <div className="w-full flex flex-col items-center justify-center">
                            <div className="w-[90%] flex items-center justify-end">
                                <TheIcon
                                    Icon={AiOutlineCloseCircle}
                                    size={"25"}
                                    iconAction={() => clearImage()}
                                />
                            </div>
                            <img
                                src={URL.createObjectURL(pic as Blob)}
                                className="max-h-[200px] rounded-lg"
                            />
                        </div>
                    ) : null}

                    {pic && typeof pic === "string" ? (
                        <img src={pic} className="w-[80%] max-h-[300px] rounded-lg" />
                    ) : null}
                    <div
                        // onClick={(event) => event.stopPropagation()}
                        className="w-[90%]"
                    >
                        <TheIcon
                            Icon={BiImageAdd}
                            size={"30"}
                            iconAction={() => fileInput.current?.click()}
                        />
                    </div>
                    {/* <FormButton form_stuff={form_stuff} /> */}
                    <PlainFormButton
                        disabled={disableButton(input)}
                        isSubmitting={mutation.isLoading}
                        label={label}
                    />
                </div>
            </form>

            <div className="m-1 w-[90%] flex  flex-col items-center justify-center">
           {error?.message !== "" ? (
                    <div
                        className="m-1 w-full text-center  line-clamp-4 p-2 bg-red-100 border-2 
                        border-red-800 text-red-900  rounded-xl"
                    >
                        {error.message}
                    </div>
                ) : null}
            </div>
        </div>
    );
};



