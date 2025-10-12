/**
 * Servicio de GitHub para el Static Deployer Worker
 */

import { validateGitHubToken, validateGitHubRepo } from '../utils/security.js';

/**
 * Disparar GitHub repository_dispatch
 */
export async function triggerGitHubDispatch(token, repo) {
  // Validar entrada
  if (!validateGitHubToken(token)) {
    throw new Error('Token de GitHub inválido');
  }

  if (!validateGitHubRepo(repo)) {
    throw new Error('Formato de repo GitHub inválido');
  }

  const url = `https://api.github.com/repos/${repo}/dispatches`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.everest-preview+json',
        'Content-Type': 'application/json',
        'User-Agent': 'ncs-static-deployer/1.0'
      },
      body: JSON.stringify({
        event_type: 'sanity-content-changed',
        client_payload: {
          timestamp: new Date().toISOString(),
          source: 'sanity-webhook',
          environment: 'production'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API error:', response.status, errorText);
    }

    return response;
  } catch (error) {
    console.error('GitHub dispatch error:', error);
    throw error;
  }
}

/**
 * Obtener información del repo
 */
export async function getRepoInfo(token, repo) {
  if (!validateGitHubToken(token) || !validateGitHubRepo(repo)) {
    throw new Error('Token o repo inválidos');
  }

  const url = `https://api.github.com/repos/${repo}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ncs-static-deployer/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('GitHub repo info error:', error);
    throw error;
  }
}
