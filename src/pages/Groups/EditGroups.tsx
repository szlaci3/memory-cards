import { useEffect, useState } from "react";
import type { GroupType } from "types/index";
import { db } from "utils/db";

interface EditGroupsProps {
	onEdit: (groupId: string) => void;
}

function EditGroups({ onEdit }: EditGroupsProps) {
	const [groups, setGroups] = useState<GroupType[]>([]);

	const [defaultGroupId, setDefaultGroupId] = useState<string | undefined>(undefined);

	useEffect(() => {
		db.groups.toArray().then(setGroups);
		db.settings.get("global").then((settings) => {
			setDefaultGroupId(settings?.defaultGroupId);
		});
	}, []);

	const handleDelete = async (id: string) => {
		if (confirm("Are you sure you want to delete this group?")) {
			await db.groups.delete(id);
			setGroups(groups.filter((g) => g.id !== id));
		}
	};

	const handleDeleteAll = async () => {
		if (confirm("Are you sure you want to delete ALL groups?")) {
			await db.groups.clear();
			setGroups([]);
		}
	};

	return (
		<div className="edit-groups-container">
			<button
				type="button"
				onClick={handleDeleteAll}
				className="delete-all-groups-btn"
			>
				Delete All Groups
			</button>
			<div className="groups-list">
				{groups.map((group) => (
					<div
						key={group.id}
						className="group-list-item"
						style={{
							backgroundColor:
								group.id === defaultGroupId ? "rgba(171, 145, 0, 0.3)" : undefined,
							border: group.id === defaultGroupId ? "1px solid rgba(171, 145, 0, 1)" : undefined,
						}}
					>
						<span className="group-name">
							{group.name} ({group.cardIds.length})
						</span>
						<div className="group-actions">
							<button type="button" onClick={() => onEdit(group.id)}>
								Edit
							</button>
							<button type="button" onClick={() => handleDelete(group.id)}>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default EditGroups;
