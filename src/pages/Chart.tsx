import { useState, useEffect } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import type { TeamMember } from "../types";
import { getAllTeamMembers } from "../api/teamMembers";
import { useAuth } from "../context/AuthContext";

function Box({ person }: { person: TeamMember }) {
    const color =
        person.position === "CEO" ? "border-purple-600 bg-purple-50" :
        person.position === "Manager" ? "border-blue-600 bg-blue-50" :
        person.position === "Project Manager" ? "border-cyan-600 bg-cyan-50" :
        person.position === "Team Leader" ? "border-green-600 bg-green-50" :
        "border-gray-400 bg-white";
    return (
        <div className={`inline-block border-2 ${color} rounded-lg px-3 py-1 shadow-sm text-center m-3`}>
            <p className="font-semibold text-gray-800 text-xs">{person.name}</p>
            <p className="text-[10px] text-gray-500">{person.roleInTeam}</p>
        </div>
    );
}

// recursively build the tree
function buildTree(person: TeamMember, all: TeamMember[]) {
    const children = all.filter((p) => p.managerId === person.id);
    return (
        <TreeNode key={person.id} label={<Box person={person} />}>
            {children.map((child) => buildTree(child, all))}
        </TreeNode>
    );
}
export function Chart() {
    const { position, team } = useAuth(); 
    const [people, setPeople] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        getAllTeamMembers().then((data) => {
            setPeople(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
 
    
    let root: TeamMember | undefined;

    if (position === "Developer") {
    root = people.find((p) => p.team_id === team && p.position === "Team Leader");

    } else if (position === "Team Leader") {
    const leader = people.find((p) => p.team_id === team && p.position === "Team Leader");
    root = people.find((p) => p.id === leader?.managerId);

    } else {
    root = people.find((p) => p.managerId == null);
}


    if (!root) return <p className="p-6">No organization structure found for your role.</p>;

    const children = people.filter((p) => p.managerId === root.id);

    return (
        <div className="overflow-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Organization Chart</h1>
            <Tree lineWidth="2px" lineColor="#9ca3af" lineBorderRadius="6px" label={<Box person={root} />}>
                {children.map((child) => buildTree(child, people))}
            </Tree>
        </div>
    );
}