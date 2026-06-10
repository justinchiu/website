# Self-audit notes: opinionatedrl + treerl drafts (2026-06-10)

Pre-audit of the math in both draft posts. Core derivations are sound (policy
gradient, token decomposition, zero-mean score, Q/V factorization, Liu et al.
head-and-tail estimator). Issues are in the claims around them, ordered by
severity. None fixed yet — fix before publishing.

## 1. "GRPO's group-mean baseline is exactly this at the root" — WRONG (treerl.mdx, point 2 of tree section)

GRPO includes the sample's own reward in the group mean and divides by group
std. The leave-one-out baseline is RLOO, not GRPO. Self-inclusive mean gives a
(1 - 1/N) scaling of the gradient term (cross terms vanish by independence),
so it's not catastrophic, but "exactly this" is false.
Fix: say RLOO, or "GRPO's baseline up to self-inclusion and std normalization."

## 2. MCTS framing overclaims (treerl.mdx, intro + tree section)

All unbiasedness arguments assume branch positions/factors chosen independently
of sampled data, children drawn i.i.d. from pi. Real MCTS uses UCB selection —
adaptive, value-dependent expansion — which biases the visit-count estimate of
p(s) and the children-as-samples estimate of pi(a|s) without corrections the
post doesn't derive. Same bug inside the Tier 2 proposal: "entropy-based"
branch positions are data-dependent.
Fix: scope sentence — "MCTS-shaped data: tree expansion and backup, not UCB
selection; adaptive tree policies need importance corrections not covered
here." And change Tier 2 to predetermined/random branch positions (or flag the
adaptivity explicitly).

## 3. Tier 1 non-LOO knockout prediction half right (treerl.mdx, experiment section)

"Error should not shrink as samples are added" holds for more trees at fixed
branch factor k (per-node ~(1 - 1/k) scaling persists). But that bias is mostly
a scaling, so the knocked-out estimator may look fine on cosine similarity.
Fix: measure direction and magnitude separately in the proposed figure. The
unweighted-dedup knockout is the genuinely wrong-direction one.

## 4. Batch-token normalization is a ratio estimator (opinionatedrl.mdx, averaging section)

|M| is random, so (1/|M|) * sum is biased via E[X/Y] != E[X]/E[Y] — vanishes
for large batches, but the strictly unbiased choice divides by a constant,
which is literally Dr. GRPO's fix. Citing them while presenting per-batch
token-count division as uniquely correct is attackable.
Fix: hedge — "divide by total active tokens (or a constant proxy for it, cf.
Dr. GRPO)".

## 5. Loose trust-region statement (opinionatedrl.mdx, off-policy section)

"Error is bounded by the KL between the policies" — actual TRPO bound is
C * max_s KL(mu||pi)(s) with horizon-dependent C (CPI version in total
variation). Also "variance grows exponentially" deserves "when per-token
ratios have nonzero variance."

## 6. Smaller

- treerl point 2 "at every internal node": non-branch nodes have no siblings;
  Q-hat is constant along an unbranched segment, valid baseline comes from the
  nearest branch point above. Add one clarifying sentence.
- Variable-length sequences: the factorization treats p(s_t) as a
  sub-probability measure for sequences ending before t. Standard informality;
  maybe a footnote.
- Subtree-mean Q: unbiased because each leaf is *marginally* a policy sample;
  leaves are correlated (affects variance only). Post asserts conclusion
  without flagging the non-i.i.d. structure.
