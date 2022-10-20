export default (req, res) => {
    const { method } = req;
  
    switch (method) {
      case 'GET':
        res.json({ method: 'GET', endpoint: 'Users' });
        break;
      case 'POST':
        res.json({ method: 'POST', endpoint: 'Users' });
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  }

//   export default function handler(req, res) {
//     res.status(200).json({ name: 'John Doe' })
//   }
  