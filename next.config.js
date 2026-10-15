/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // How It Works chapters 003-007 were first published with Spanish slugs.
    const renamedChapters = {
      'aprender-por-capas-backpropagation': 'learning-in-layers-backpropagation',
      'redes-convolucionales-lenet-alexnet': 'convolutional-networks-lenet-alexnet',
      'inviernos-ia-aprendizaje-estadistico': 'ai-winters-statistical-learning',
      'rnn-lstm-problema-secuencias': 'rnn-lstm-sequence-problem',
      'embeddings-representacion-lenguaje': 'embeddings-language-representation',
    }
    return Object.entries(renamedChapters).map(([from, to]) => ({
      source: `/how-it-works/${from}`,
      destination: `/how-it-works/${to}`,
      permanent: true,
    }))
  },
}

module.exports = nextConfig
