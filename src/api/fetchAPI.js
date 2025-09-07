
export async function getPokemons() {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=100&offset=0";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    //console.log(result);
    return result;
  } catch (error) {
    console.error(error.message);
  }
}