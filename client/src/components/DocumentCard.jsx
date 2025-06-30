import { Link } from 'react-router-dom';
import { Card} from '@/components/ui/card';
import { Button} from '@/components/ui/button';
import { Badge} from '@/components/ui/badge';

export default function DocumentCard({ doc }) {
  return (
    <Card className="p-4 space-y-2">
      <h3 className="text-lg font-semibold">{doc.title}</h3>
      {doc.language && <Badge>{doc.language}</Badge>}
      <div className="flex justify-between">
        <Link to={`/document/${doc.id}`}><Button variant="link">View</Button></Link>
      </div>
    </Card>
  );
}
