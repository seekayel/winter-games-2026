import { useGameStore } from '../../stores/useGameStore'
import { SLEDS } from '../../constants/sleds'
import { Button } from './common/Button'
import { CoinDisplay } from './common/CoinDisplay'
import { ProgressBar } from './common/ProgressBar'

export function SledShop() {
  const {
    sponsorDollars,
    ownedSleds,
    selectedSledId,
    buySled,
    selectSled,
    spendSponsorDollars,
    setScreen,
  } = useGameStore()

  const handleBuy = (sledId: string, price: number) => {
    if (spendSponsorDollars(price)) {
      buySled(sledId)
      selectSled(sledId)
    }
  }

  return (
    <div className="flex flex-col items-center h-full px-4 py-8 overflow-y-auto">
      <div className="flex items-center justify-between w-full max-w-lg mb-6">
        <Button variant="secondary" size="sm" onClick={() => setScreen('main-menu')}>
          Back
        </Button>
        <h2 className="text-2xl font-bold text-white">Sled Shop</h2>
        <CoinDisplay amount={sponsorDollars} />
      </div>

      <div className="grid gap-4 w-full max-w-lg">
        {SLEDS.map((sled) => {
          const owned = ownedSleds.includes(sled.id)
          const selected = selectedSledId === sled.id
          const canAfford = sponsorDollars >= sled.price

          return (
            <div
              key={sled.id}
              className={`p-5 rounded-xl border-2 transition-all ${
                selected
                  ? 'bg-ice-700/60 border-ice-400'
                  : 'bg-ice-800/50 border-ice-600/20'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ backgroundColor: sled.color }}
                    />
                    {sled.name}
                  </h3>
                  <span className="text-xs text-ice-400 uppercase tracking-wider">
                    {sled.variant}
                  </span>
                </div>
                <div>
                  {owned ? (
                    selected ? (
                      <span className="text-xs bg-ice-500/20 text-ice-300 px-3 py-1 rounded-full">
                        Equipped
                      </span>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => selectSled(sled.id)}>
                        Equip
                      </Button>
                    )
                  ) : (
                    <Button
                      size="sm"
                      variant="gold"
                      onClick={() => handleBuy(sled.id, sled.price)}
                      disabled={!canAfford}
                    >
                      ${sled.price.toLocaleString()}
                    </Button>
                  )}
                </div>
              </div>

              {/* Stat bars */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <StatBar label="Speed" value={sled.speed} color="bg-red-400" />
                <StatBar label="Accel" value={sled.accel} color="bg-green-400" />
                <StatBar label="Handling" value={sled.handling} color="bg-blue-400" />
                <StatBar label="Braking" value={sled.braking} color="bg-yellow-400" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-ice-300 mb-0.5">
        <span>{label}</span>
        <span>{value}/10</span>
      </div>
      <ProgressBar value={value} max={10} color={color} />
    </div>
  )
}
