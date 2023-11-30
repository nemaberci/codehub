import { IconProps } from "@phosphor-icons/react";
import React from "react";

export default function FileIcon({ icon }: { icon: React.ComponentType<IconProps> }) {
	const Icon = icon;
	return <Icon size={16} />;
}
