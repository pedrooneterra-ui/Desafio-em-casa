"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Target, TrendingDown, TrendingUp, Calendar, User, Scale, Ruler, Dumbbell, CheckCircle2, UtensilsCrossed, Apple, CreditCard, Check, Flame, Droplet, Moon, Heart } from "lucide-react"

interface UserData {
  nome: string
  idade: number
  altura: number
  peso: number
  objetivo: "emagrecer" | "engordar"
}

interface Exercise {
  id: number
  nome: string
  quantidade: string
  calorias: number
  nivel: "Iniciante" | "Intermediário" | "Avançado"
  concluido: boolean
}

interface Refeicao {
  tipo: string
  alimentos: string[]
  calorias: number
}

export default function Home() {
  const [step, setStep] = useState<"objetivo" | "form" | "pagamento" | "dashboard">("objetivo")
  const [objetivo, setObjetivo] = useState<"emagrecer" | "engordar">("emagrecer")
  const [parcelas, setParcelas] = useState<number>(1)
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false)
  const [userData, setUserData] = useState<UserData>({
    nome: "",
    idade: 0,
    altura: 0,
    peso: 0,
    objetivo: "emagrecer"
  })

  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    altura: "",
    peso: ""
  })

  const [exercicios, setExercicios] = useState<Exercise[]>([
    { id: 1, nome: "Caminhada Rápida", quantidade: "30 min", calorias: 150, nivel: "Iniciante", concluido: false },
    { id: 2, nome: "Corrida Leve", quantidade: "20 min", calorias: 200, nivel: "Intermediário", concluido: false },
    { id: 3, nome: "Polichinelos", quantidade: "50 repetições", calorias: 100, nivel: "Iniciante", concluido: false },
    { id: 4, nome: "Agachamentos", quantidade: "30 repetições", calorias: 120, nivel: "Intermediário", concluido: false },
    { id: 5, nome: "Flexões", quantidade: "20 repetições", calorias: 90, nivel: "Intermediário", concluido: false },
    { id: 6, nome: "Prancha", quantidade: "5 min", calorias: 50, nivel: "Iniciante", concluido: false },
    { id: 7, nome: "Burpees", quantidade: "20 repetições", calorias: 180, nivel: "Avançado", concluido: false },
    { id: 8, nome: "Pular Corda", quantidade: "200 pulos", calorias: 170, nivel: "Intermediário", concluido: false },
    { id: 9, nome: "Abdominais", quantidade: "40 repetições", calorias: 80, nivel: "Iniciante", concluido: false },
    { id: 10, nome: "Yoga/Alongamento", quantidade: "20 min", calorias: 70, nivel: "Iniciante", concluido: false },
  ])

  const calcularIMC = (peso: number, altura: number) => {
    const alturaMetros = altura / 100
    return (peso / (alturaMetros * alturaMetros)).toFixed(1)
  }

  const calcularPesoIdeal = (altura: number) => {
    const alturaMetros = altura / 100
    return (22 * alturaMetros * alturaMetros).toFixed(1)
  }

  const calcularMetaDiaria = (pesoAtual: number, pesoIdeal: number, objetivo: string) => {
    const diferenca = objetivo === "emagrecer" 
      ? pesoAtual - parseFloat(pesoIdeal)
      : parseFloat(pesoIdeal) - pesoAtual
    return (diferenca / 30).toFixed(2)
  }

  const calcularCaloriasDiarias = (peso: number, altura: number, idade: number, imc: number, objetivo: string) => {
    const tmb = 10 * peso + 6.25 * altura - 5 * idade + 5
    const imcNum = parseFloat(imc.toString())
    
    if (objetivo === "emagrecer") {
      let deficitCaloricoPercentual = 0.20
      if (imcNum > 30) {
        deficitCaloricoPercentual = 0.25
      } else if (imcNum > 25) {
        deficitCaloricoPercentual = 0.20
      } else {
        deficitCaloricoPercentual = 0.15
      }
      const caloriasDiarias = Math.round(tmb * 1.375 * (1 - deficitCaloricoPercentual))
      return caloriasDiarias
    } else {
      const superavitCaloricoPercentual = 0.15
      const caloriasDiarias = Math.round(tmb * 1.55 * (1 + superavitCaloricoPercentual))
      return caloriasDiarias
    }
  }

  const gerarPlanoAlimentar = (caloriasDiarias: number, imc: number, objetivo: string): Refeicao[] => {
    const imcNum = parseFloat(imc.toString())
    const caloriasCafe = Math.round(caloriasDiarias * 0.25)
    const caloriasAlmoco = Math.round(caloriasDiarias * 0.35)
    const caloriasJantar = Math.round(caloriasDiarias * 0.30)
    const caloriasLanches = Math.round(caloriasDiarias * 0.10)

    let plano: Refeicao[] = []

    if (objetivo === "emagrecer") {
      if (imcNum > 30) {
        plano.push({
          tipo: "Café da Manhã",
          alimentos: ["2 ovos mexidos", "1 fatia de pão integral", "1 xícara de café sem açúcar", "1 fruta pequena (maçã ou pera)"],
          calorias: caloriasCafe
        })
      } else if (imcNum > 25) {
        plano.push({
          tipo: "Café da Manhã",
          alimentos: ["1 iogurte natural desnatado", "2 colheres de aveia", "1 banana", "1 colher de mel", "Café ou chá sem açúcar"],
          calorias: caloriasCafe
        })
      } else {
        plano.push({
          tipo: "Café da Manhã",
          alimentos: ["2 fatias de pão integral", "2 colheres de pasta de amendoim", "1 banana", "Café com leite desnatado"],
          calorias: caloriasCafe
        })
      }

      if (imcNum > 30) {
        plano.push({
          tipo: "Almoço",
          alimentos: ["150g de peito de frango grelhado", "Salada verde à vontade", "3 colheres de arroz integral", "2 colheres de feijão", "Legumes cozidos no vapor"],
          calorias: caloriasAlmoco
        })
      } else if (imcNum > 25) {
        plano.push({
          tipo: "Almoço",
          alimentos: ["150g de peixe grelhado", "4 colheres de arroz integral", "Salada verde com azeite", "3 colheres de feijão", "Brócolis no vapor"],
          calorias: caloriasAlmoco
        })
      } else {
        plano.push({
          tipo: "Almoço",
          alimentos: ["150g de carne magra grelhada", "5 colheres de arroz integral", "Salada completa", "3 colheres de feijão", "Legumes variados"],
          calorias: caloriasAlmoco
        })
      }

      if (imcNum > 30) {
        plano.push({
          tipo: "Jantar",
          alimentos: ["Omelete de 2 ovos com legumes", "Salada verde à vontade", "1 fatia de pão integral", "Chá verde"],
          calorias: caloriasJantar
        })
      } else if (imcNum > 25) {
        plano.push({
          tipo: "Jantar",
          alimentos: ["150g de frango desfiado", "Sopa de legumes", "2 fatias de pão integral", "Salada verde"],
          calorias: caloriasJantar
        })
      } else {
        plano.push({
          tipo: "Jantar",
          alimentos: ["150g de peixe assado", "Batata doce média", "Salada completa", "Legumes grelhados"],
          calorias: caloriasJantar
        })
      }

      plano.push({
        tipo: "Lanches (2x ao dia)",
        alimentos: ["1 fruta (maçã, pera ou laranja)", "10 castanhas ou amêndoas", "OU 1 iogurte natural", "OU cenoura com homus"],
        calorias: caloriasLanches
      })
    } else {
      plano.push({
        tipo: "Café da Manhã",
        alimentos: ["3 ovos mexidos com queijo", "2 fatias de pão integral com manteiga", "1 copo de leite integral", "1 banana com aveia e mel", "Café com açúcar"],
        calorias: caloriasCafe
      })

      plano.push({
        tipo: "Almoço",
        alimentos: ["200g de carne vermelha ou frango", "6 colheres de arroz branco", "4 colheres de feijão", "Batata ou mandioca", "Salada com azeite", "1 suco natural"],
        calorias: caloriasAlmoco
      })

      plano.push({
        tipo: "Jantar",
        alimentos: ["200g de peixe ou frango", "Macarrão integral ou arroz", "Legumes refogados", "Salada completa", "1 fatia de queijo"],
        calorias: caloriasJantar
      })

      plano.push({
        tipo: "Lanches (3x ao dia)",
        alimentos: ["Vitamina de frutas com aveia e whey", "Sanduíche de pasta de amendoim", "Mix de castanhas (30g)", "Iogurte integral com granola", "Batata doce com frango"],
        calorias: caloriasLanches
      })
    }

    return plano
  }

  const toggleExercicio = (id: number) => {
    setExercicios(prev => 
      prev.map(ex => ex.id === id ? { ...ex, concluido: !ex.concluido } : ex)
    )
  }

  const calcularCaloriasTotais = () => {
    return exercicios
      .filter(ex => ex.concluido)
      .reduce((total, ex) => total + ex.calorias, 0)
  }

  const handleObjetivoSelect = (obj: "emagrecer" | "engordar") => {
    setObjetivo(obj)
    setStep("form")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const data: UserData = {
      nome: formData.nome,
      idade: parseInt(formData.idade),
      altura: parseFloat(formData.altura),
      peso: parseFloat(formData.peso),
      objetivo: objetivo
    }

    setUserData(data)
    setStep("pagamento")
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleConfirmarPagamento = () => {
    setPagamentoConfirmado(true)
    setTimeout(() => {
      setStep("dashboard")
    }, 1500)
  }

  const valorParcela = (50 / parcelas).toFixed(2)

  if (step === "objetivo") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-4 animate-pulse">
              <Target className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Transforme Sua Vida
            </CardTitle>
            <CardDescription className="text-xl text-gray-600">
              Escolha seu objetivo e comece sua jornada de transformação em 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <button
              onClick={() => handleObjetivoSelect("emagrecer")}
              className="w-full p-10 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 hover:from-emerald-500 hover:to-teal-700 transition-all duration-300 group shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingDown className="w-10 h-10 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-3xl font-bold text-white mb-2">Emagrecer</h3>
                  <p className="text-emerald-50 text-lg">Perca peso de forma saudável e sustentável</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleObjetivoSelect("engordar")}
              className="w-full p-10 rounded-3xl bg-gradient-to-br from-blue-400 to-indigo-600 hover:from-blue-500 hover:to-indigo-700 transition-all duration-300 group shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-3xl font-bold text-white mb-2">Ganhar Peso</h3>
                  <p className="text-blue-50 text-lg">Aumente massa de forma saudável e controlada</p>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "form") {
    const corTema = objetivo === "emagrecer" 
      ? { gradient: "from-emerald-400 to-teal-600", text: "text-emerald-600", bg: "bg-emerald-600", ring: "focus:ring-emerald-500" }
      : { gradient: "from-blue-400 to-indigo-600", text: "text-blue-600", bg: "bg-blue-600", ring: "focus:ring-blue-500" }

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className={`mx-auto w-20 h-20 bg-gradient-to-br ${corTema.gradient} rounded-3xl flex items-center justify-center mb-4`}>
              {objetivo === "emagrecer" ? (
                <TrendingDown className="w-10 h-10 text-white" />
              ) : (
                <TrendingUp className="w-10 h-10 text-white" />
              )}
            </div>
            <CardTitle className={`text-4xl font-bold bg-gradient-to-r ${corTema.gradient} bg-clip-text text-transparent`}>
              Desafio 30 Dias
            </CardTitle>
            <CardDescription className="text-lg">
              {objetivo === "emagrecer" 
                ? "Comece sua jornada de emagrecimento hoje mesmo"
                : "Comece sua jornada de ganho de peso hoje mesmo"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="nome" className={`text-base font-semibold flex items-center gap-2 ${corTema.text}`}>
                  <User className="w-5 h-5" />
                  Nome Completo
                </Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  required
                  className={`h-14 text-lg border-2 ${corTema.ring}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="idade" className={`text-base font-semibold flex items-center gap-2 ${corTema.text}`}>
                    <Calendar className="w-5 h-5" />
                    Idade
                  </Label>
                  <Input
                    id="idade"
                    type="number"
                    placeholder="25"
                    value={formData.idade}
                    onChange={(e) => handleInputChange("idade", e.target.value)}
                    required
                    min="1"
                    max="120"
                    className={`h-14 text-lg border-2 ${corTema.ring}`}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="altura" className={`text-base font-semibold flex items-center gap-2 ${corTema.text}`}>
                    <Ruler className="w-5 h-5" />
                    Altura (cm)
                  </Label>
                  <Input
                    id="altura"
                    type="number"
                    placeholder="170"
                    value={formData.altura}
                    onChange={(e) => handleInputChange("altura", e.target.value)}
                    required
                    min="100"
                    max="250"
                    step="0.1"
                    className={`h-14 text-lg border-2 ${corTema.ring}`}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="peso" className={`text-base font-semibold flex items-center gap-2 ${corTema.text}`}>
                    <Scale className="w-5 h-5" />
                    Peso (kg)
                  </Label>
                  <Input
                    id="peso"
                    type="number"
                    placeholder="75.5"
                    value={formData.peso}
                    onChange={(e) => handleInputChange("peso", e.target.value)}
                    required
                    min="30"
                    max="300"
                    step="0.1"
                    className={`h-14 text-lg border-2 ${corTema.ring}`}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className={`w-full h-16 bg-gradient-to-r ${corTema.gradient} hover:opacity-90 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300`}
              >
                Continuar para Pagamento
              </Button>

              <Button
                type="button"
                onClick={() => setStep("objetivo")}
                variant="outline"
                className="w-full h-14 text-base border-2"
              >
                Voltar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "pagamento") {
    const corTema = objetivo === "emagrecer" 
      ? { gradient: "from-emerald-400 to-teal-600", text: "text-emerald-600" }
      : { gradient: "from-blue-400 to-indigo-600", text: "text-blue-600" }

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className={`mx-auto w-20 h-20 bg-gradient-to-br ${corTema.gradient} rounded-3xl flex items-center justify-center mb-4`}>
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <CardTitle className={`text-4xl font-bold bg-gradient-to-r ${corTema.gradient} bg-clip-text text-transparent`}>
              Pagamento do Plano
            </CardTitle>
            <CardDescription className="text-lg">
              Escolha a forma de pagamento que melhor se adequa a você
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {pagamentoConfirmado ? (
              <div className="text-center py-12 space-y-6">
                <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <Check className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-green-600">Pagamento Confirmado!</h3>
                <p className="text-gray-600 text-lg">Redirecionando para seu dashboard...</p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-8 border-2 border-orange-300 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-700 font-semibold text-lg">Valor Total:</span>
                    <span className="text-5xl font-bold text-orange-600">R$ 50,00</span>
                  </div>
                  <p className="text-gray-600">Acesso completo ao plano de 30 dias</p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="parcelas" className={`text-base font-semibold flex items-center gap-2 ${corTema.text}`}>
                    <CreditCard className="w-5 h-5" />
                    Número de Parcelas
                  </Label>
                  <Select value={parcelas.toString()} onValueChange={(value) => setParcelas(parseInt(value))}>
                    <SelectTrigger className="h-14 text-lg border-2">
                      <SelectValue placeholder="Selecione o número de parcelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()} className="text-base">
                          {num}x de R$ {(50 / num).toFixed(2)} {num === 1 ? "(à vista)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 space-y-4 shadow-lg">
                  <h4 className="font-bold text-gray-900 text-xl mb-4">Resumo do Pagamento</h4>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-base">Valor Total:</span>
                    <span className="font-bold text-gray-900 text-lg">R$ 50,00</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-base">Parcelas:</span>
                    <span className="font-bold text-gray-900 text-lg">{parcelas}x</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                    <span className="text-gray-900 font-semibold text-lg">Valor da Parcela:</span>
                    <span className={`text-3xl font-bold ${corTema.text}`}>R$ {valorParcela}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                  <p className="text-blue-900 font-medium space-y-2">
                    <span className="block">✓ Acesso imediato ao plano completo</span>
                    <span className="block">✓ Plano alimentar personalizado</span>
                    <span className="block">✓ Lista de exercícios adaptados</span>
                    <span className="block">✓ Acompanhamento de progresso diário</span>
                  </p>
                </div>

                <Button 
                  onClick={handleConfirmarPagamento}
                  className={`w-full h-16 bg-gradient-to-r ${corTema.gradient} hover:opacity-90 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300`}
                >
                  Confirmar Pagamento
                </Button>

                <Button
                  type="button"
                  onClick={() => setStep("form")}
                  variant="outline"
                  className="w-full h-14 text-base border-2"
                >
                  Voltar
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const imc = calcularIMC(userData.peso, userData.altura)
  const pesoIdeal = calcularPesoIdeal(userData.altura)
  const metaDiaria = calcularMetaDiaria(userData.peso, parseFloat(pesoIdeal), userData.objetivo)
  const progressoAtual = 0
  const diasRestantes = 30
  const caloriasTotais = calcularCaloriasTotais()
  const exerciciosConcluidos = exercicios.filter(ex => ex.concluido).length
  const caloriasDiarias = calcularCaloriasDiarias(userData.peso, userData.altura, userData.idade, parseFloat(imc), userData.objetivo)
  const planoAlimentar = gerarPlanoAlimentar(caloriasDiarias, parseFloat(imc), userData.objetivo)

  const getClassificacaoIMC = (imc: string) => {
    const imcNum = parseFloat(imc)
    if (imcNum < 18.5) return { texto: "Abaixo do peso", cor: "text-blue-600", bg: "bg-blue-100" }
    if (imcNum < 25) return { texto: "Peso normal", cor: "text-green-600", bg: "bg-green-100" }
    if (imcNum < 30) return { texto: "Sobrepeso", cor: "text-yellow-600", bg: "bg-yellow-100" }
    return { texto: "Obesidade", cor: "text-red-600", bg: "bg-red-100" }
  }

  const classificacaoIMC = getClassificacaoIMC(imc)

  const corTema = userData.objetivo === "emagrecer"
    ? { gradient: "from-emerald-500 to-teal-600", icon: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700", hover: "hover:bg-emerald-50" }
    : { gradient: "from-blue-500 to-indigo-600", icon: "text-blue-600", badge: "bg-blue-100 text-blue-700", hover: "hover:bg-blue-50" }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header com Saudação */}
        <div className="text-center space-y-3 py-6">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Olá, {userData.nome.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            {userData.objetivo === "emagrecer" 
              ? "Bem-vindo ao seu desafio de emagrecimento de 30 dias"
              : "Bem-vindo ao seu desafio de ganho de peso de 30 dias"
            }
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardDescription className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <Scale className="w-4 h-4" />
                Peso Atual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">{userData.peso}</span>
                <span className="text-xl text-gray-500">kg</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardDescription className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Peso Ideal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold ${corTema.icon}`}>{pesoIdeal}</span>
                <span className="text-xl text-gray-500">kg</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardDescription className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                IMC Atual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold ${classificacaoIMC.cor}`}>{imc}</span>
                <span className="text-xl text-gray-500">kg/m²</span>
              </div>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${classificacaoIMC.bg} ${classificacaoIMC.cor}`}>
                {classificacaoIMC.texto}
              </span>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardDescription className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <Flame className="w-4 h-4" />
                Meta Diária
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-orange-600">{metaDiaria}</span>
                <span className="text-xl text-gray-500">kg/dia</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progresso do Desafio */}
        <Card className={`border-0 shadow-2xl bg-gradient-to-br ${corTema.gradient} text-white`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white text-2xl">
              {userData.objetivo === "emagrecer" ? (
                <TrendingDown className="w-8 h-8" />
              ) : (
                <TrendingUp className="w-8 h-8" />
              )}
              Progresso do Desafio
            </CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Dia {30 - diasRestantes + 1} de 30
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={progressoAtual} className="h-4 bg-white/20" />
            <div className="flex justify-between items-center text-base font-medium">
              <span>Início: {userData.peso} kg</span>
              <span>Meta: {pesoIdeal} kg</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-6">
              <p className="text-center text-lg">
                Faltam <span className="font-bold text-3xl">{diasRestantes}</span> dias para completar seu desafio!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Plano Alimentar */}
        <Card className="border-0 shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <UtensilsCrossed className={`w-8 h-8 ${corTema.icon}`} />
                  Plano Alimentar Personalizado
                </CardTitle>
                <CardDescription className="mt-3 text-base">
                  {userData.objetivo === "emagrecer"
                    ? "Dieta balanceada para emagrecimento saudável"
                    : "Dieta balanceada para ganho de peso saudável"
                  }
                </CardDescription>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold ${corTema.icon}`}>{caloriasDiarias}</div>
                <div className="text-sm text-gray-500 font-medium">calorias/dia</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {planoAlimentar.map((refeicao, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border-2 border-gray-100 bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 ${corTema.hover}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                      <Apple className={`w-6 h-6 ${corTema.icon}`} />
                      {refeicao.tipo}
                    </h3>
                    <span className={`px-4 py-2 ${corTema.badge} rounded-full text-base font-bold`}>
                      {refeicao.calorias} kcal
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {refeicao.alimentos.map((alimento, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-base text-gray-700">
                        <span className={userData.objetivo === "emagrecer" ? "text-emerald-500 text-xl" : "text-blue-500 text-xl"}>✓</span>
                        <span>{alimento}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-orange-200">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                💡 Dicas Importantes
              </h4>
              <ul className="space-y-3 text-base text-gray-700">
                {userData.objetivo === "emagrecer" ? (
                  <>
                    <li className="flex items-start gap-3">
                      <Droplet className="w-5 h-5 text-blue-500 mt-1" />
                      <span>Beba pelo menos 2 litros de água por dia</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-orange-500 text-xl">•</span>
                      <span>Evite frituras, refrigerantes e alimentos processados</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-orange-500 text-xl">•</span>
                      <span>Faça refeições a cada 3 horas para manter o metabolismo ativo</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Moon className="w-5 h-5 text-indigo-500 mt-1" />
                      <span>Evite comer 2-3 horas antes de dormir</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-3">
                      <span className="text-orange-500 text-xl">•</span>
                      <span>Faça 5-6 refeições por dia para manter o superávit calórico</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-orange-500 text-xl">•</span>
                      <span>Priorize alimentos ricos em proteínas e carboidratos complexos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Droplet className="w-5 h-5 text-blue-500 mt-1" />
                      <span>Beba bastante água e sucos naturais</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Dumbbell className="w-5 h-5 text-purple-500 mt-1" />
                      <span>Combine alimentação com treino de força para ganho de massa</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Exercícios */}
        <Card className="border-0 shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <Dumbbell className={`w-8 h-8 ${corTema.icon}`} />
                  Lista de Exercícios
                </CardTitle>
                <CardDescription className="mt-3 text-base">
                  Marque os exercícios que você completou hoje
                </CardDescription>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold ${corTema.icon}`}>{caloriasTotais}</div>
                <div className="text-sm text-gray-500 font-medium">calorias queimadas</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exercicios.map((exercicio) => (
                <div
                  key={exercicio.id}
                  onClick={() => toggleExercicio(exercicio.id)}
                  className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:shadow-xl ${
                    exercicio.concluido
                      ? userData.objetivo === "emagrecer"
                        ? "bg-emerald-50 border-emerald-500"
                        : "bg-blue-50 border-blue-500"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-5 flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        exercicio.concluido
                          ? userData.objetivo === "emagrecer"
                            ? "bg-emerald-500 text-white"
                            : "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-bold text-lg ${
                          exercicio.concluido 
                            ? userData.objetivo === "emagrecer"
                              ? "text-emerald-700"
                              : "text-blue-700"
                            : "text-gray-900"
                        }`}
                      >
                        {exercicio.nome}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-base text-gray-600">{exercicio.quantidade}</span>
                        <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                          {exercicio.nivel}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">
                      {exercicio.calorias}
                    </div>
                    <div className="text-sm text-gray-500">kcal</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base text-gray-600 mb-1">Exercícios Concluídos</p>
                  <p className={`text-3xl font-bold ${corTema.icon}`}>
                    {exerciciosConcluidos} / {exercicios.length}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base text-gray-600 mb-1">Progresso</p>
                  <p className={`text-3xl font-bold ${corTema.icon}`}>
                    {Math.round((exerciciosConcluidos / exercicios.length) * 100)}%
                  </p>
                </div>
              </div>
              <Progress
                value={(exerciciosConcluidos / exercicios.length) * 100}
                className="h-3 mt-4"
              />
            </div>
          </CardContent>
        </Card>

        {/* Botão de Reiniciar */}
        <div className="text-center pt-6 pb-8">
          <Button
            onClick={() => {
              setStep("objetivo")
              setFormData({ nome: "", idade: "", altura: "", peso: "" })
              setParcelas(1)
              setPagamentoConfirmado(false)
              setExercicios(prev => prev.map(ex => ({ ...ex, concluido: false })))
            }}
            variant="outline"
            className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 px-8 py-6 text-lg font-semibold"
          >
            Recomeçar com Novos Dados
          </Button>
        </div>
      </div>
    </div>
  )
}
