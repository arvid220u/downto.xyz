# downto.xyz

threat model: when submitting preferences, the server is honest. the server may be compromised at any point.

idea:

1. we establish a public key directory when the key is generated from the email and password.
2. for each pair of users, we store an encrypted secret string $k || r$, as well as an unencrypted string $f(k || r)$ where $f$ is a one-way function.
3. for each preference $j$ of user $i$, the user computes $h = hash(j || i) \xor k$.
4. user $i$ submits $h$, $r$, $i$, $j$.
5. the server compares $h$ to its current set of preferences. if there's not a match, $h$ is added to the set.
6. if $h$ is in the set already, the server verifies that $f(h \xor hash(j || i) || r)$ is equal to the stored value for $i$ and $j$.
7. if it is, there is a match! the server sends an email to $i$ and to $j$, and then discards $r$, $i$ and $j$.

database tables:

1. users
2. secrets
3. likes

to prevent knowledge of who has used the website, all tables are filled with random keys in the beginning
