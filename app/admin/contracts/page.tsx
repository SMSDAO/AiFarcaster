'use client';

// app/admin/contracts/page.tsx
// Admin Contract Deployment page.
// Allows ADMIN users to register deployed contract addresses, view the
// registry, and update records with real on-chain addresses after deployment.

import { useState, useEffect, useCallback } from 'react';
import { Code2, Plus, RefreshCw, Copy, CheckCircle2, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Contract {
  id: string;
  address: string;
  label: string | null;
  deployedById: string;
  createdAt: string;
}

interface DeployFormState {
  bytecode: string;
  label: string;
}

interface PatchFormState {
  contractId: string;
  address: string;
  label: string;
}

export default function AdminContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<DeployFormState>({ bytecode: '', label: '' });
  const [deploying, setDeploying] = useState(false);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [patchForm, setPatchForm] = useState<PatchFormState | null>(null);
  const [patching, setPatching] = useState(false);
  const [patchError, setPatchError] = useState<string | null>(null);

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Cookies are sent automatically for same-origin requests; the API
      // validates the Supabase session from those cookies.
      const res = await fetch('/api/admin/contracts');
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as Contract[];
      setContracts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load contracts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  async function handleDeploy(e: React.FormEvent) {
    e.preventDefault();
    setDeploying(true);
    setDeployError(null);

    try {
      const res = await fetch('/api/admin/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bytecode: form.bytecode, label: form.label || undefined }),
      });

      const body = (await res.json()) as Contract & { error?: string };
      if (!res.ok) {
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      setContracts((prev) => [body, ...prev]);
      setForm({ bytecode: '', label: '' });
    } catch (e) {
      setDeployError(e instanceof Error ? e.message : 'Deployment failed');
    } finally {
      setDeploying(false);
    }
  }

  async function handlePatch(e: React.FormEvent) {
    e.preventDefault();
    if (!patchForm) return;
    setPatching(true);
    setPatchError(null);

    try {
      const res = await fetch('/api/admin/contracts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: patchForm.contractId,
          address: patchForm.address,
          label: patchForm.label || undefined,
        }),
      });

      const body = (await res.json()) as Contract & { error?: string };
      if (!res.ok) {
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      setContracts((prev) =>
        prev.map((c) => (c.id === body.id ? body : c)),
      );
      setPatchForm(null);
    } catch (e) {
      setPatchError(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setPatching(false);
    }
  }

  function copyAddress(address: string, id: string) {
    navigator.clipboard.writeText(address).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Contract Registry
        </h1>
        <button
          onClick={fetchContracts}
          disabled={loading}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
        >
          <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Deploy Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <Plus className="w-5 h-5 text-purple-600" />
          <span>Register Deployment</span>
        </h2>

        <form onSubmit={handleDeploy} className="space-y-4">
          <div>
            <label
              htmlFor="label"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Label <span className="text-gray-400">(optional)</span>
            </label>
            <input
              id="label"
              type="text"
              maxLength={100}
              placeholder="e.g. MyToken v1.0"
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label
              htmlFor="bytecode"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Contract Bytecode <span className="text-red-500">*</span>
            </label>
            <textarea
              id="bytecode"
              required
              rows={4}
              placeholder="0x608060405234801561001057600080fd5b50..."
              value={form.bytecode}
              onChange={(e) => setForm((f) => ({ ...f, bytecode: e.target.value }))}
              className="w-full px-3 py-2 text-sm font-mono border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 resize-y"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Paste the compiled EVM bytecode (0x-prefixed hex string). A
              placeholder address is derived from the hash until you update it
              with the real on-chain address via the edit button.
            </p>
          </div>

          {deployError && (
            <p className="text-sm text-red-600 dark:text-red-400">{deployError}</p>
          )}

          <button
            type="submit"
            disabled={deploying || !form.bytecode}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm font-medium rounded-lg transition"
          >
            <Code2 className="w-4 h-4" />
            <span>{deploying ? 'Registering…' : 'Register Contract'}</span>
          </button>
        </form>
      </div>

      {/* Update Address Modal */}
      {patchForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-2 border-purple-500">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Pencil className="w-5 h-5 text-purple-600" />
            <span>Update Contract Address</span>
          </h2>
          <form onSubmit={handlePatch} className="space-y-4">
            <div>
              <label
                htmlFor="patch-address"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Real On-chain Address <span className="text-red-500">*</span>
              </label>
              <input
                id="patch-address"
                type="text"
                required
                placeholder="0xAbCd…1234"
                value={patchForm.address}
                onChange={(e) =>
                  setPatchForm((f) => f && { ...f, address: e.target.value })
                }
                className="w-full px-3 py-2 text-sm font-mono border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label
                htmlFor="patch-label"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Label <span className="text-gray-400">(optional)</span>
              </label>
              <input
                id="patch-label"
                type="text"
                maxLength={100}
                value={patchForm.label}
                onChange={(e) =>
                  setPatchForm((f) => f && { ...f, label: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            {patchError && (
              <p className="text-sm text-red-600 dark:text-red-400">{patchError}</p>
            )}
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={patching}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm font-medium rounded-lg transition"
              >
                {patching ? 'Saving…' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={() => setPatchForm(null)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contract List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Deployed Contracts
            {contracts.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                {contracts.length}
              </span>
            )}
          </h2>
        </div>

        {error && (
          <div className="p-6 text-sm text-red-600 dark:text-red-400">{error}</div>
        )}

        {!error && loading && (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"
              />
            ))}
          </div>
        )}

        {!error && !loading && contracts.length === 0 && (
          <div className="p-12 text-center">
            <Code2 className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No contracts registered yet.
            </p>
          </div>
        )}

        {!error && !loading && contracts.length > 0 && (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {contracts.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="min-w-0 flex-1 mr-4">
                  {c.label && (
                    <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-0.5">
                      {c.label}
                    </p>
                  )}
                  <p className="text-sm font-mono text-gray-900 dark:text-white truncate">
                    {c.address}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Deployed by{' '}
                    <span className="font-mono">{c.deployedById}</span>
                    {' · '}
                    {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <button
                    onClick={() =>
                      setPatchForm({
                        contractId: c.id,
                        address: c.address,
                        label: c.label ?? '',
                      })
                    }
                    className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded"
                    aria-label="Edit address"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => copyAddress(c.address, c.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded"
                    aria-label="Copy address"
                  >
                    {copiedId === c.id ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
