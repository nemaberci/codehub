import { useState } from "react";
import { Tabs } from "react-daisyui";

export default function TabView({
	filename
}: {
	filename: string;
}) {
	const [tabValue, setTabValue] = useState(0);
	return (
		<Tabs value={tabValue} onChange={setTabValue} boxed className="bg-transparent">
			<Tabs.Tab value={0}>{filename}</Tabs.Tab>
			<></>
		</Tabs>
	);
}
