import React,{useState,useEffect} from 'react';

import NewsCards  from './Components/NewsCards/NewsCards';
import alanBtn from '@alan-ai/alan-sdk-web';
import useStyles from './styles.js'

import alanlogo from './alan.jpg';

import wordsToNumbers from 'words-to-numbers';

const alanKey='f50a96f33fd7bbd701e9d826a20b1a072e956eca572e1d8b807a3e2338fdd0dc/stage';


const App =()=>{
    const [newsArticles, setNewsArticles] = useState([]);
    const [activeArticle,setActiveArticle] = useState(-1);
    const classes = useStyles();
    

    useEffect(() => {
        let alanInstance = null;
    
        if (!alanInstance) {
            alanInstance = alanBtn({
                key: alanKey,
                onCommand: ({ command, articles, number }) => {
                    if (command === 'newHeadlines') {
                        console.log(articles);
                        setNewsArticles(articles);
                        setActiveArticle(-1);
                    } else if (command === 'highlight') {
                        setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
                    } else if (command === 'open') {
                        const parsedNumber =
                            number.length > 2 ? wordsToNumbers(number, { fuzzy: true }) : number;
                        const article = articles[parsedNumber - 1];
    
                        if (parsedNumber > 20) {
                            alanInstance.playText('Please try that again. ');
                        } else if (article) {
                            window.open(article.url, '_blank');
                            alanInstance.playText('Opening...');
                        }
                    }
                },
            });
        }
    
        return () => {
            // Clean up the Alan instance when the component unmounts
            alanInstance && alanInstance.destroy();
        };
    }, [alanKey]);
    
    return(
        <div>
            <div className={classes.logoContainer}>
                <img src={alanlogo} className={classes.alanLogo} alt="alan Logo"></img>
            </div>
            <NewsCards articles = {newsArticles} activeArticle={activeArticle}/>
        </div>
    );
}

export default App;
