import React from 'react';
import {Text} from '../../../../components/Text'
import styles from './index.module.scss';
import {ReactComponent as LinkIcon} from 'assets/images/icons/external-link.svg'; 

type StoryMentionProps = {
    url: string;
    sentAt: Date;
    fromContact: boolean;
}

const timeElapsedInHours = (sentAt: Date) => {
    const millisecondsDiff = new Date().getTime() - new Date(sentAt).getTime()
    console.log('(millisecondsDiff / (1000 * 60 * 60)) % 24', (millisecondsDiff / (1000 * 60 * 60)) % 24)
    return (millisecondsDiff / (1000 * 60 * 60)) % 24
}

export const StoryMention = ({url, sentAt, fromContact}:StoryMentionProps) => {
    return(
       <>
       <div className={`${fromContact ? styles.contactContent : styles.memberContent}`}>
            {timeElapsedInHours(sentAt) <= 24 ? (
                <>
                <div className={styles.activeStory}>
                    <a className={styles.activeStoryLink} href={url} target="_blank" rel="noopener noreferrer">mentioned in an active Instagram story <LinkIcon/></a>
                </div>
                </>   
            ):
                <span className={styles.expiredStory}> mentioned in an expired Instagram story</span>
            } 
        </div>
    </>
    )
}