# movies_words

#### Everything's currently working on heroku. [Click here](https://movies-words.herokuapp.com/)

Hey folks, this website is for ones who watch English movies and want to improve their vocabulary. Visit the website and check out the FAQ(s) page to know how to use this website.

**Home page**:
![Home page](public/home-movies-words-ts.vercel.app.png 'Home page')

**Search Movies result**
![search movies result](public/search-result-movies-words-ts.vercel.app.png 'Search Movies result')

**Movie Details Page**:
![Movie details](public/movie-details-movies-words-ts.vercel.app_movies.png 'movie details page')

**FAQ(s) Page**:
![FAQ(s) page](<public/FAQ(s)-movies-words-ts.vercel.app.png> 'FAQ(s) page')

### Core Tech Used

-   [Next.js](https://nextjs.org/)
-   [Redux](https://redux.js.org/)
-   [MYSQL](https://www.mysql.com/)
-   [Material-UI](https://material-ui.com/)
-   [AWS S3](https://aws.amazon.com/s3/)
-   [Vercel](https://vercel.com/)
-   [JWT](https://jwt.io/), [SendGrid](https://sendgrid.com/), [Free SQL server](https://remotemysql.com/tutor1.html)
-   Check out my `package.json` file for further insights

### Feature that's currently not working in live website

Once you upload your subtitle and click on the extract button underneath it, we generate some of the "difficult" or "infrequent" words from the subtitle file as shown below thus making your work easier to add the words.

Criteria for the word to be "difficult" or "infrequent":-

-   Word length should be more than 5
-   Should return true from [check-word](https://www.npmjs.com/package/check-word) npm package
-   Should not be profane word from [bad-words](https://www.npmjs.com/package/bad-words) npm package
-   Should not match with the words in our excel database.

[Reason for the failure](https://vercel.com/docs/platform/limits#general-limits) - Serverless Function Execution Timeout (Seconds) - 10(Hobby plan)

![](public/extract_subtitle.gif)
