import { fontSize } from '../../../typography.config';
import { Button } from "@components/Button";
import { SvgIcon } from "@components/SvgIcon";

const iconNames = ["bars-solid","down","facebook","left","instagram","Link","magnifying-glass","pangeya","right","tiktok","up","X","xmark-solid","youtube"];

export default function StyleGuide() {
  return (
    <main className="p-8 space-y-8 bg-white text-main-text">
      <h1 className="text-4xl font-bold mb-6">StyleGuide</h1>

      {Object.entries(fontSize).map(([name, [size, config]]) => (
        <div key={name} className="border-b border-main-grey pb-4">
          <p className="text-sm text-main-grey">{name}</p>
          <p
            className="select-text"
            style={{
              fontSize: size,
              lineHeight: config.lineHeight,
              letterSpacing: config.letterSpacing,
              fontWeight: config.fontWeight,
              fontFamily: 'var(--font-fira), sans-serif',
            }}
          >
            The quick brown fox jumps over the lazy dog
          </p>
          <p className="text-xs text-main-grey mt-1">
            Size: {size} | Line height: {config.lineHeight} | Letter spacing: {config.letterSpacing} | Weight: {config.fontWeight}
          </p>
        </div>
      ))}
      <div className="grid grid-cols-12 gap-4">
        <div className="space-y-4 p-4 col-span-2 flex flex-col flex items-center justify-center gap-2 m-auto">
          <Button variant="accent">Accent Button</Button>
          <Button variant="accent" disabled>Accent Button</Button>
          <Button variant="accent" iconOnly> <SvgIcon name="right" size={24} color="white"/> </Button>
          <Button variant="accent" iconOnly disabled> <SvgIcon name="right" size={24} color="white"/> </Button>        
        </div>
        <div className="space-y-4 p-4 col-span-2 flex flex-col items-center justify-center gap-2 m-auto">
          <Button variant="primary">Primary Button</Button>
          <Button variant="primary" disabled>Primary Button</Button>
          <Button variant="primary" iconOnly> <SvgIcon name="right" size={24} color="white"/> </Button>
          <Button variant="primary" iconOnly disabled> <SvgIcon name="right" size={24} color="white"/> </Button> 
        </div>
        <div className="space-y-4 p-4 col-span-2 flex flex-col items-center justify-center gap-2 m-auto">
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="secondary" disabled>Secondary Button</Button>
          <Button variant="secondary" iconOnly> <SvgIcon name="right" size={24} color="main-blue"/> </Button>
          <Button variant="secondary" iconOnly disabled> <SvgIcon name="right" size={24} color="main-grey"/> </Button>
        </div>
        <div className="space-y-4 p-4 col-span-2 flex flex-col items-center justify-center gap-2 m-auto">
          <Button variant="tertiary">Tertiary Button</Button>
          <Button variant="tertiary" disabled>Tertiary Button</Button>
          <Button variant="tertiary" iconOnly> <SvgIcon name="right" size={24} color="main-blue"/> </Button>
          <Button variant="tertiary" iconOnly disabled> <SvgIcon name="right" size={24} color="main-grey"/> </Button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 bg-main-blue ">
        <div className="space-y-4 p-4 col-span-2 flex flex-col items-center justify-center gap-2 m-auto">
          <Button variant="accent-alt">Accent-alt Button</Button>
          <Button variant="accent-alt" disabled>Accent-alt Button</Button>
          <Button variant="accent-alt" iconOnly> <SvgIcon name="right" size={24} color="main-blue"/> </Button>
          <Button variant="accent-alt" iconOnly disabled> <SvgIcon name="right" size={24} color="white"/> </Button>
        </div>
        <div className="space-y-4 p-4 col-span-2 flex flex-col items-center justify-center gap-2 m-auto">
          <Button variant="primary">Primary Button</Button>
          <Button variant="primary" disabled>Primary Button</Button>
          <Button variant="primary" iconOnly> <SvgIcon name="right" size={24} color="white"/> </Button>
          <Button variant="primary" iconOnly disabled> <SvgIcon name="right" size={24} color="white"/> </Button>
        </div>
        <div className="space-y-4 p-4 col-span-2 flex flex-col items-center justify-center gap-2 m-auto">
          <Button variant="secondary-alt">secondary-alt Button</Button>
          <Button variant="secondary-alt" disabled>secondary-alt Button</Button>
          <Button variant="secondary-alt" iconOnly> <SvgIcon name="right" size={24} color="white"/> </Button>
          <Button variant="secondary-alt" iconOnly disabled> <SvgIcon name="right" size={24} color="main-grey"/> </Button>
        </div>
        <div className="space-y-4 p-4 col-span-2 flex flex-col items-center justify-center gap-2 m-auto">
          <Button variant="tertiary-alt">Tertiary-alt Button</Button>
          <Button variant="tertiary-alt" disabled>Tertiary-alt Button</Button>
          <Button variant="tertiary-alt" iconOnly> <SvgIcon name="right" size={24} color="white"/> </Button>
          <Button variant="tertiary-alt" iconOnly disabled> <SvgIcon name="right" size={24} color="main-grey"/> </Button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 bg-main-blue ">
        <div className="space-y-4 p-4 col-span-8">
          <div className="grid grid-cols-12 gap-4">
            {iconNames.map((iconName) => (
              <div className="space-y-4 p-4 col-span-3 flex flex-col items-center justify-center gap-2 m-auto">
                  <Button variant="accent-alt" iconOnly> <SvgIcon name={iconName} size={24} color="main-blue"/> </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
