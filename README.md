# downto

find out mutual likes, without revealing unrequited likes to anyone. (previously hosted at downto.xyz)

## privacy

threat model: when submitting preferences, the server is honest. however, the server may be compromised at any point in the future. the database may be compromised at any point.

### protocol

1. we establish a public key directory when a user verifies their email.
2. for each pair of users i and j, we store an encrypted secret string $k_{ij} || r_{ij}$, as well as an unencrypted string $f(k_{ij} || r_{ij})$ where $f$ is a one-way function (in our case, SHA-256).
3. for each person $l$ that user $i$ likes, the user computes $h = hash(l || i) \xor k$ or $h = hash(i || l) \xor k$, depending on the alphabetical ordering of $l$ and $i$.
4. user $i$ submits to the server a list of tuples $(h, r, i, l)$, one for each person $l$ that they like.
5. the server compares $h$ to its current set of like identifiers. if there's not a match, $h$ is added to the set.
6. if $h$ is in the set already, the server verifies that $f(h \xor hash(l || i) || r)$ is equal to the stored value of $f$ for $i$ and $l$.
7. if it is, there is a match! the server sends an email to $i$ and to $l$, and then discards $r$, $i$ and $l$.

to prevent knowledge of who has used the website, all tables are filled with random keys in the beginning. this requires us to modify the protocol above slightly, by storing two versions of $k$ and $r$ for each pair of users.

to prove security, one would use the fact that $h$ is encrypted using a one-time pad, which is known to be perfectly secure. the stored value of $f$ functions as a zero-knowledge proof that the user has computed $h$ for the correct set of users, and the nonce $r$ is used to ensure that it is impossible to figure out the preimage of the $h$s even though there are only $O(n^2)$ such pairs with $n$ users.
