import { useState } from "react";
import { Tabs } from "react-daisyui";

export default function TabView() {
	const [tabValue, setTabValue] = useState(0);
	return (
		<Tabs value={tabValue} onChange={setTabValue} boxed className="bg-transparent">
			<Tabs.Tab value={0}>Solution.java</Tabs.Tab>
			<Tabs.Tab value={1}>AnotherClass.java</Tabs.Tab>
			<Tabs.Tab value={2}>AnotherClass2.java</Tabs.Tab>
			<Tabs.Tab value={3}>+</Tabs.Tab>
		</Tabs>
	);
}
