'use client';

import { useEffect, useRef, useState } from 'react';
import { cn, configureAssistant, getSubjectColor } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import soundwaves from '@/constants/soundwaves.json';
import { addToSessionHistory, SavedMessage } from "@/lib/actions/companion.actions";
import { CompanionComponentProps } from '@/types';
import { subjects } from '@/constants';

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

const CompanionComponent = ({
    companionId,
    subject,
    topic,
    name,
    userName,
    userImage,
    style,
    voice,
    instructions,
    resumeMessages = [],
}: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [messages, setMessages] = useState<SavedMessage[]>(resumeMessages);
    const [shouldResume, setShouldResume] = useState(resumeMessages.length > 0);

    const lottieRef = useRef<LottieRefCurrentProps>(null);

    const cfg = subjects.find((s) => s.id === subject)!;
    const iconUrl = cfg.icon;

    useEffect(() => {
        if (lottieRef.current) {
            if (isSpeaking) lottieRef.current.play();
            else lottieRef.current.stop();
        }
    }, [isSpeaking]);

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

        const onCallEnd = async () => {
            setCallStatus(CallStatus.FINISHED);
            setCallStatus(CallStatus.FINISHED);
            try {
                await addToSessionHistory(companionId, messages);
            } catch (err) {
                console.error("Failed saving session history:", err);
            }
        };

        const onMessage = (message: Message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage = { role: message.role, content: message.transcript };
                setMessages((prev) => [newMessage, ...prev]);
            }
        };

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);
        const onError = (err: Error) => console.log('Error', err);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);
        vapi.on('error', onError);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
            vapi.off('error', onError);
        };
    }, [companionId, messages]);

    const toggleMicrophone = () => {
        const muted = vapi.isMuted();
        vapi.setMuted(!muted);
        setIsMuted(!muted);
    };

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        const resumeHistory = shouldResume
            ? messages
                .slice()
                .reverse()
                .map(m =>
                    `${m.role === 'assistant'
                        ? name.split(' ')[0].replace(/[.,]/g, '')
                        : userName
                    }: ${m.content}`
                )
                .join('\n')
            : undefined;

        const assistantOverrides = {
            variableValues: { subject, topic, style, instructions, resumeHistory },
            clientMessages: ["transcript"],
        };

        // @ts-expect-error – vapi.start has no TS signature yet
        vapi.start(configureAssistant(voice, style,resumeHistory), assistantOverrides);
    };

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    };

    return (

        <section className="flex flex-col h-[70vh]">
            {resumeMessages.length > 0 && (
                <div className="mb-4">
                    <label className="mr-4">
                        <input
                            type="radio"
                            checked={shouldResume}
                            onChange={() => setShouldResume(true)}
                        /> Resume last session
                    </label>
                    <label>
                        <input
                            type="radio"
                            checked={!shouldResume}
                            onChange={() => setShouldResume(false)}
                        /> Start new session
                    </label>
                </div>
            )}

            <section className="flex gap-8 max-sm:flex-col">
                <div className="companion-section">
                    <div
                        className="companion-avatar"
                        style={{ backgroundColor: getSubjectColor(subject) }}
                    >
                        <div
                            className={cn(
                                'absolute transition-opacity duration-1000',
                                callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse'
                            )}
                        >
                            <Image
                                src={iconUrl}
                                alt={cfg.label}
                                width={150}
                                height={150}
                                className="max-sm:w-fit"
                            />
                        </div>
                        <div
                            className={cn(
                                'absolute transition-opacity duration-1000',
                                callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0'
                            )}
                        >
                            <Lottie
                                lottieRef={lottieRef}
                                animationData={soundwaves}
                                autoplay={false}
                                className="companion-lottie"
                            />
                        </div>
                    </div>
                    <p className="font-bold text-2xl">{name}</p>
                </div>

                <div className="user-section">
                    <div className="user-avatar">
                        <Image
                            src={userImage}
                            alt={userName}
                            width={130}
                            height={130}
                            className="rounded-lg"
                        />
                        <p className="font-bold text-2xl">{userName}</p>
                    </div>
                    <button
                        className="btn-mic"
                        onClick={toggleMicrophone}
                        disabled={callStatus !== CallStatus.ACTIVE}
                    >
                        <Image
                            src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'}
                            alt="mic"
                            width={36}
                            height={36}
                        />
                        <p className="max-sm:hidden">
                            {isMuted ? 'Turn on microphone' : 'Turn off microphone'}
                        </p>
                    </button>
                    <button
                        className={cn(
                            'rounded-lg py-2 cursor-pointer transition-colors w-full text-white dark:border dark:bg-black',
                            callStatus === CallStatus.ACTIVE ? 'bg-red-700' : 'bg-primary',
                            callStatus === CallStatus.CONNECTING && 'animate-pulse'
                        )}
                        onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
                    >
                        {callStatus === CallStatus.ACTIVE
                            ? 'End Session'
                            : callStatus === CallStatus.CONNECTING
                                ? 'Connecting'
                                : 'Start Session'}
                    </button>
                </div>
            </section>

            <section className="transcript border border-black rounded-lg">
                <div className="transcript-message no-scrollbar">
                    {messages.map((message, index) => {
                        if (message.role === 'assistant') {
                            return (
                                <p key={index} className="max-sm:text-sm">
                                    {name.split(' ')[0].replace(/[.,]/g, '')}: {message.content}
                                </p>
                            );
                        } else {
                            return (
                                <p key={index} className="text-primary max-sm:text-sm">
                                    {userName}: {message.content}
                                </p>
                            );
                        }
                    })}
                </div>
                <div className="transcript-fade" />
            </section>
        </section>
    );
};

export default CompanionComponent;
