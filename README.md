# Ord API

Simple TypeScript client for `ord` API.
See the [docs](https://docs.ordinals.com/guides/api).

## Usage

```bash
npm install ordapi
```

```jsx
import { OrdClient } from 'ordapi';

function App() {
  const [blockInfo, setBlockInfo] = useState(null);

  useEffect(() => {
    // Create client instance
    const client = new OrdClient('https://your-ordinals-server.xyz');

    // Fetch genesis block info
    async function fetchBlock() {
      try {
        const block = await client.getBlock(0);
        setBlockInfo(block);
      } catch (err) {
        console.error('Failed to fetch block:', err);
      }
    }

    fetchBlock();
  }, []);

  return (
    <div>
      <h1>Genesis Block</h1>
      <p>Height: {blockInfo.height}</p>
      <p>Hash: {blockInfo.hash}</p>
      <p>Number of transactions: {blockInfo.transactions.length}</p>
    </div>
  );
}
```
