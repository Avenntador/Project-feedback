export async function getData<T>(query: string): Promise<T> {
    let result = fetch(query);
    return (await result).json();
}
