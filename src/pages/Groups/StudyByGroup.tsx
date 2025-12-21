import type { GroupType } from "types/index";

interface StudyByGroupProps {
	group: GroupType;
}

function StudyByGroup({ group }: StudyByGroupProps) {
	return (
		<div>
			<h2>Study {group.name}</h2>
			<p>Study session for this group is coming soon.</p>
		</div>
	);
}

export default StudyByGroup;
