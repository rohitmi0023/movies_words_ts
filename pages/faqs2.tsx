// /tnAuB8q5vv7Ax9UAEje5Xi4BXik.jpg
import React from 'react';
import NavBar from '../components/NavBar';
import { Typography } from '@material-ui/core';

const faqs2 = () => {
	return (
		<div style={{ position: 'relative' }}>
			<NavBar />
			<div
				className='imageWrapper'
				style={{
					backgroundImage: 'url(' + `https://image.tmdb.org/t/p/original/tnAuB8q5vv7Ax9UAEje5Xi4BXik.jpg` + ')',
					backgroundSize: 'contain',
					backgroundPosition: 'center',
					width: '100%',
				}}
			>
				<div style={{ zIndex: 1, opacity: 1, position: 'relative', color: 'white', marginTop: '15vh' }}>
					<Typography variant='h2' style={{ textAlign: 'center' }}>
						FAQs
					</Typography>
					<div style={{ margin: '10px 40px' }}>
						<Typography variant='h4'>What this website is all about?</Typography>
						<Typography variant='h6' style={{ marginLeft: '15px' }}>
							Basically, it stores the "difficult" words that are used in movies. The purpose being that once you are able to get
							yourself familiar with the hard to apprehend words and then watch the movie, you will enjoy the movie much more and
							simultaneously drastically enhancing your English.
						</Typography>
						<br />
						<Typography variant='h4'>How do I store words?</Typography>
						<Typography variant='h6' style={{ marginLeft: '20px' }}>
							So, for that there are <b>two</b> ways of doing it :-
							<br />
							<ol type='A'>
								<li>
									Manual addition. For example, while watching the movie <b>Predestination</b> you discover <b>fugitive</b> word in
									the movie and want to save it here. Then,
									<ul>
										<li>
											Search for <b>Predestination</b> movie in the homepage.
										</li>
										<li>Click on the desired movie poster. You will now be redirected to the movie page.</li>
										<li>
											Type <b>fugitive</b> in the <i>Add new word</i> input form and click submit button.
										</li>
										<li>That's it, your word is saved.</li>
									</ul>
								</li>
								<li>
									Word fetching. This is done by using the movie subtitles to extract few of the "difficult" words.
									<ul>
										<li> The first two steps remains the same as above.</li>
										<li>Now you have to upload the movie subitle there.</li>
										<li>After successful upload, click on extract button and then we will suggest some of the words from it.</li>
										<li>You can add or remove the suggested words from list.</li>
									</ul>
								</li>
							</ol>
						</Typography>
						<br />
						<Typography variant='h4'>What makes this website different from a note app?</Typography>
						<Typography variant='h6' style={{ marginLeft: '20px', marginBottom: '5vh' }}>
							There are few things that makes it more useful than notes app till now:-
							<ul>
								<li>The extracted words from the subtitle is a great feauture that is unique.</li>
								<li>
									You can see the words added by other people that makes your work much lesser i.e. you don't have to add all of
									them by yourself.
								</li>
								<li>We will randomly give you the most popular words and other facts/information about words/movies in general.</li>
								<li>Your words are saved in our secured cloud database that will enusure that your data will not be lost.</li>
							</ul>
						</Typography>
					</div>
				</div>
			</div>

			<p>Hello</p>
		</div>
	);
};

export default faqs2;
