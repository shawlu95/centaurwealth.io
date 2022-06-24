# Double-Entry Bookkeeping

This is an accounting app to help individuals and busiensses manage their wealth and export financial statements in the most professional style. Say good bye to [mint](mint.com) and [acorns](acorns.com). Life is too short for amateur finance.

## Microservice Design

This is a read-heavy app because each transaction is written o``nly once, but accessed many times when user retrieves a list of transaction or requests a chart or table that aggregates over transactions.

- auth service: handle user account creation, login, logout
- ledger service: handle double-entry bookkeeping record
- networth service: calculate asset, liability on a fixed interval
- balance sheet service: listens to write event and automatically update current/historic balance sheet
- budget service: listens to expense event from ledger service and group expense into category. Support budget planning

## Learning Experience

- Docker & Kubernetes
- Test-driven development
- Continuous integration

### Deployment

We use Digital Ocean to deploy the app.

1. Create cluster on web console
2. Add context to local
3. To setup ingress-nginx, use the [digital ocean](https://kubernetes.github.io/ingress-nginx/deploy/#digital-ocean) command from documentation.
4. Set up secret
5. Manually execute deploy (see [deploy-manifests.yaml](./.github/workflows/deploy-manifests.yaml))

```bash
# Mac easy
brew install doctl

# get the access token on web
doctl auth init

# get connection info of the new cluster
# context has been switched, all kubectl command will be issued to digital ocean
doctl kubernetes cluster kubeconfig save centaur

# list all contexts (check the 'context' sections)
kubectl config view

# switch context (can also do from Docker desktop app)
kubectl config use-context <context_name>
kubectl config use-context docker-desktop

# delete context
kubectl config get-contexts
kubectl config delete-context do-sfo3-centaur

# set up secret after switching context
kubectl create secret generic jwt-secret --from-literal=jwt=foo
```
