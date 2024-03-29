import { useEffect, useState } from 'react';
import './App.css';
import {
	AwtWebSDK,
	Env,
	AwtAccount,
	WalletConfig,
} from '@avatarwallet/web-sdk';
import { ethers, Wallet } from 'ethers';

const BSC = 56,
	BSC_TEST = 97,
	opBNB = 204,
	opBNB_TEST = 5611;

const awtWeb: AwtWebSDK = new AwtWebSDK({
	env: Env.production,
	defaultNetworkId: opBNB,
});

function App() {
	const [account, setAccount] = useState<AwtAccount | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [message, setMessage] = useState<string>('');
	const [signature, setSignature] = useState<string>('');
	const [txId, setTxId] = useState<string>('');
	const [receiveAddress, setReceiveAddress] = useState<string>('');

	const connect = async () => {
		try {
			const ac = await awtWeb.connect({
				logo: '',
				name: 'demo',
			});
			if (ac) {
				setAccount(ac);
			}
			console.log('account', ac);
		} catch (error) {
			console.log('connect error', error);
		}
	};
	const disconnect = async () => {
		try {
			awtWeb.disconnect();
			setAccount(null);
		} catch (error) {
			console.log('disconnect error', error);
		}
	};
	const signMessage = async () => {
		try {
			console.log(awtWeb.getAccount());
			const _signature = await awtWeb.signMessage(message);
			setSignature(_signature);
		} catch (error) {
			console.log('signMessage error', error);
		}
	};
	const sendTx = async () => {
		try {
			if (!ethers.isAddress(receiveAddress)) {
				alert('Please enter the ETH address');
				return;
			}
			const _txid = await awtWeb.sendTransaction([
				{
					callType: '0',
					revertOnError: false,
					gasLimit: '0',
					target: receiveAddress,
					value: String(0.00001 * 10 ** 18),
					data: '0x',
				},
			]);
			setTxId(_txid);
		} catch (error) {
			console.log('sendTx error', error);
		}
	};

	useEffect(() => {
		const _isConnected = awtWeb.isConnected();
		setIsConnected(_isConnected);
	}, [account]);

	useEffect(() => {
		const _account = awtWeb.getAccount();
		setAccount(_account || null);
	}, []);

	return (
		<>
			<div className="">
				<div>
					<h1>Avatarwallet Web Sdk Demo</h1>
					<div className="">isConnected :{String(isConnected)}</div>
					<div className="">
						address :{account?.address} <br />
						email :{account?.email} <br />
						loginType :{account?.loginType} <br />
						chainId :{
							awtWeb.getWalletConfig().defaultNetworkId
						}{' '}
						<br />
					</div>
					<br />
					<br />
					{isConnected ? (
						<button onClick={disconnect}>disconnect</button>
					) : (
						<button onClick={connect}>connect wallet</button>
					)}
					<br />
					<br />
					<input
						type="text"
						style={{ width: '500px' }}
						placeholder="Message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					<br />
					<button onClick={signMessage}>signMessage</button>
					<br />
					signature:
					<br />
					{signature && (
						<textarea
							style={{ width: '500px' }}
							value={`${signature}`}
							rows={10}
						/>
					)}
					<br />
					<br />
					<input
						type="text"
						style={{ width: '500px' }}
						placeholder="ReceiveAddress"
						value={receiveAddress}
						onChange={(e) => setReceiveAddress(e.target.value)}
					/>
					<br />
					<button onClick={sendTx}>Send 0.00001 Nataive token</button>
					<br />
					{txId && (
						<span>
							txId:
							<br />
							{txId}
						</span>
					)}
				</div>
			</div>
		</>
	);
}

export default App;
