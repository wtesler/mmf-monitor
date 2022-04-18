# Algorithmic Trading with Staked Liquidity Pools

An algorithmic trader which swaps between staked Defi liquidity pools.

## Setup Gcloud

gcloud auth login --update-adc
gcloud config set project mmf-monitor

### For developers

Use `firebase serve --only functions` to run locally.

Use `firebase deploy --only functions:<FUNCTION_NAME>` to deploy.

Deploy functions one at a time for safety.

When deploying, if asked about deleting functions
not found in local source code. Always say **NO**.
