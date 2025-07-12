import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function DashboardCard({
  title,
  description,
  icon,
  count,
  type,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  type: string;
}) {
  return (
    <Card className="bg-sky-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
            {title}
          </CardTitle>
          {icon}
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {count} {type}
      </CardContent>
    </Card>
  );
}
