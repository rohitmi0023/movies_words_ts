import React from 'react';
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Provider } from 'react-redux';
import { createWrapper } from 'next-redux-wrapper';
import { store, persistor } from '../store/store';
import { PersistGate } from 'redux-persist/integration/react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';

function MyApp({ Component, pageProps }) {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	let theme = React.useMemo(
		() =>
			createMuiTheme({
				palette: {
					type: prefersDarkMode ? 'dark' : 'light',
				},
			}),
		[prefersDarkMode]
	);
	theme = responsiveFontSizes(theme);
	return (
		<ThemeProvider theme={theme}>
			<Provider store={store}>
				<PersistGate persistor={persistor}>
					<Component {...pageProps} />
				</PersistGate>
			</Provider>
		</ThemeProvider>
	);
}

const makestore = () => store;
const wrapper = createWrapper(makestore);

export default wrapper.withRedux(MyApp);
