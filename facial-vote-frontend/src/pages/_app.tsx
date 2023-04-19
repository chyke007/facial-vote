import 'src/styles/globals.css'
import type { AppProps } from 'next/app'
import { Amplify } from 'aws-amplify'
import { awsExport } from 'src/utils/aws-export';

Amplify.configure(awsExport);

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
