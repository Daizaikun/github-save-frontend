import { FC, useEffect, useState } from "react";
import { gql, useQuery } from "urql";
import { person } from "../types/person";

const peopleQuery = gql`
query GetUser($username: String!) {

  getUser(username: $username) {
    name
    avatarUrl
    githubID
    apiUrl
    htmlUrl
    location
    publicRepos
    followers
    following
    login
    save
}
}`;

const useFetcherPerson = (name: string) => {
	const [result] = useQuery({
		query: peopleQuery,
		variables: {
			username: name,
		},
	});

	return {
		person: result?.data?.getUser as person,
		error: result.error,
		loading: result.fetching,
	};
};

type UserProps = { name: string };

export const User: FC<UserProps> = ({ name }) => {
	const { person: user, error, loading } = useFetcherPerson(name);

	const [save, setSave] = useState(user?.save ?? false);

	useEffect(() => {
		setSave(user?.save ?? false);
	}, [user?.save]);

	const handleClick = () => {
		setSave((save) => !save);
	};

	if (error) return <div className="text-red-500">Failed to load user</div>;
	if (!user && loading) return <div className="text-blue-500">Loading...</div>;

	return (
		<div className="flex flex-col items-center p-8 space-y-6">
			<img
				className="w-32 h-32 rounded-full"
				src={user.avatarUrl}
				alt={user.name}
			/>
			<h3 className="text-lg font-semibold dark:text-gray-100">{user.name}</h3>
			<span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100">
				{user.login}
			</span>
			<p className="text-gray-600 dark:text-gray-300">
				Followers: {user.followers || "N/A"}
			</p>

			<p className="text-gray-600 dark:text-gray-300">
				Location: {user.location || "N/A"}
			</p>
			<p className="text-gray-600 dark:text-gray-300">
				Public repos: {user.location}
			</p>
			<div className="flex space-x-4 w-full">
				<a
					href={user.htmlUrl}
					className="w-full py-2 text-center font-semibold text-white rounded-lg shadow-md hover:bg-gray-700 bg-gray-800"
				>
					Github
				</a>
				<button
					onClick={handleClick}
					type="button"
					className="w-full py-2 text-center font-semibold text-white rounded-lg shadow-md hover:bg-gray-700 bg-gray-800"
				>
					{save ? "Eliminar" : "Guardar"}
				</button>
			</div>
		</div>
	);
};
