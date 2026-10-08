// Contexts describe what the mathematical model is doing, without asserting
// that a simplified worksheet is a certified physical or financial forecast.
export type SituationContext={setting:string;story:string};
const contexts:Record<string,SituationContext>={};
function add(ids:string,setting:string,story:string){for(const id of ids.split(' '))contexts[id]={setting,story}}
add('sum difference product quotient remainder double half bond','School supply room','A teacher counts, combines, shares or packs classroom supplies.');
add('number-distance absolute','Temperature station','Signed readings are compared by their separation from another reading or from zero.');
add('hundreds tens place-value decimal-place hundredths tenths','Digital measuring display','A display combines place-value contributions to reconstruct a reading.');
add('even odd successor predecessor','Ticket-number system','An organizer assigns consecutive or alternating ticket numbers.');
add('round-ten round-hundred','Warehouse estimate','A stock count is rounded before estimating storage and transport needs.');
add('average-two arithmetic-mean','Two reading calibration','A technician uses the middle of two equally weighted readings.');
add('fraction-value fraction-percent percent-decimal','Survey dashboard','A dashboard converts a share between fraction, decimal and percent forms.');
add('fraction-quantity percent-of','Recipe planning','A cook needs a specified fraction or percentage of a total mixture.');
add('fraction-add fraction-subtract fraction-multiply fraction-divide mixed','Recipe measuring cups','Fractional cup quantities are combined, compared, scaled or divided into batches.');
add('reciprocal','Machine cycle conversion','A technician converts between a nonzero rate and time per unit.');
add('equivalent-num equivalent-den ratio-quotient ratio-share proportion-fourth','Paint mixing plan','A designer preserves a mixture ratio or divides a total between ingredients.');
add('direct inverse','Workshop production model','Output follows a constant proportionality model; changing one factor changes the other.');
add('unitary','Grocery price comparison','A shopper compares the cost per item in a pack.');
add('scale-length','Trail map','A map converts a drawing length to a real distance using a stated scale.');
add('percent-increase percent-decrease percent-change successive-change reverse-percent','Community club report','A club compares membership counts before and after percentage changes.');
add('gcd','Equal hamper packing','A charity finds the largest equal group size that divides two stock quantities.');
add('lcm','Repeating timetable','Two repeating activities next coincide at a common multiple of their intervals.');
add('square square-root square-number-difference','Square paving design','A designer connects a square side length with its area and the change between neighboring sizes.');
add('cube cube-root','Cubic storage model','A packer connects a cube edge with the quantity of space it occupies.');
add('power power-product power-quotient power-power negative-power fractional-power power-product-base','Repeated scaling system','A digital model uses powers to represent repeated scaling and inverse scaling.');
add('scientific','Scientific instrument display','A measured quantity is stored as a mantissa times a power of ten.');
add('surd-product surd-quotient rationalize','Precision geometry worksheet','A designer keeps radical quantities exact before converting them to a decimal measurement.');
add('factorial permutations combinations binomial-coefficient replacement-orders','Event scheduling','An organizer counts arrangements or selections under the stated ordering and replacement rules.');
add('triangular-number sum-natural sum-odd sum-even','Tiered seating plan','Rows gain seats in a regular counting pattern, and the planner needs a total.');
add('profit loss profit-rate loss-rate sell-profit sell-loss cost-from-profit','Craft market stall','A stall compares cost and selling prices or sets a price from a stated margin.');
add('discount-amount sale-price marked-price','Bookshop offer','A shop converts between marked price, discount and the amount a customer pays.');
add('tax-amount tax-inclusive tax-exclusive','Illustrative invoice','An invoice adds or removes a stated teaching percentage. The rate is illustrative.');
add('simple-interest simple-amount interest-principal interest-rate interest-time','Fixed-principal savings worksheet','A student models simple interest with an annual percentage rate and time in years.');
add('compound-amount compound-interest periodic-compound','Compounding savings worksheet','A student compares balances when interest is compounded at the stated intervals.');
add('depreciation','Equipment value model','An equipment value falls by the same percentage each modeled year.');
add('population-growth','Habitat count model','A habitat count is projected under a simplified constant annual growth assumption.');
add('continuous-growth doubling-time exponential exponential-base','Culture growth model','A laboratory worksheet models continuous or exponential growth under a fixed-rate assumption.');
add('linear-value linear-solve inverse-linear composition-linear','Sensor calibration','A device maps a raw reading through linear calibration steps, or recovers the original input.');
add('square-sum square-difference difference-squares three-square sum-square-pair product-from-squares','Adjustable square panel','A design worksheet uses an algebraic identity to evaluate area expressions for combined lengths.');
add('sum-cubes difference-cubes cube-sum cube-difference','Modular cubic storage','A storage worksheet compares cubic quantities using sum and difference identities.');
add('quadratic-value cubic-value remainder-theorem','Polynomial control model','A software worksheet evaluates a polynomial model or checks its value at a selected input.');
add('discriminant root-plus root-minus root-sum root-product vertex-x vertex-y','Quadratic design model','A design worksheet examines roots or the turning point of its stated quadratic model.');
add('two-lines-x two-lines-y','Two-condition budgeting model','Two linear conditions constrain the same unknown quantities, so they must be solved together.');
add('ap-term ap-sum ap-last-sum ap-difference ap-index','Auditorium row plan','Seat counts form an arithmetic progression with a fixed change between rows.');
add('gp-term gp-sum gp-infinite','Repeated reduction design','A digital design uses a geometric progression. Infinite totals require a ratio whose magnitude is below one.');
add('geometric-mean harmonic-mean','Two-rate comparison','A worksheet uses the stated geometric or harmonic mean, rather than treating every average as arithmetic.');
add('sum-squares sequences-series-sum-cubes','Nested display construction','A planner totals square or cubic quantities for a sequence of increasing sizes.');
add('binomial-term','Two-choice expansion model','A software verification worksheet checks a specific term in a binomial expansion.');
add('fibonacci-binet','Recursive pattern display','A designer checks the index of a Fibonacci pattern with the closed-form approximation.');
add('harmonic-term','Reciprocal spacing design','A layout model uses the reciprocal of an arithmetic progression to set spacing.');
add('square-area square-perimeter square-diagonal','Square courtyard','A builder measures the covering, boundary or corner-to-corner span of a square courtyard.');
add('rectangle-area rectangle-perimeter rectangle-diagonal','Rectangular garden','A gardener plans the ground covering, fencing or a diagonal path.');
add('triangle-area triangle-perimeter triangle-height equilateral-area equilateral-height','Triangular fabric panel','A maker measures a triangular fabric panel, using a height perpendicular to the chosen base.');
add('parallelogram-area parallelogram-perimeter','Slanted roof panel','A roof worksheet distinguishes the perpendicular height from the slanted side length.');
add('rhombus-area rhombus-perimeter kite-area','Kite workshop','A maker measures a kite-shaped or rhombus-shaped panel using its sides or perpendicular diagonals.');
add('trapezium-area','Land parcel survey','A surveyor models a parcel with parallel boundaries and their perpendicular separation.');
add('regular-perimeter regular-area regular-radius-area regular-apothem','Polygonal pavilion','A regular pavilion plan uses equal sides, an apothem or a circumradius to determine measurements.');
add('interior-sum regular-angle exterior-angle polygon-diagonals','Polygon frame assembly','A maker checks corner angles, turning angles or internal brace counts in a polygonal frame.');
add('circle-area circle-circumference circle-diameter circle-radius','Circular garden border','A landscape worksheet converts between radius, diameter, boundary length and ground area.');
add('semicircle-area semicircle-perimeter','Arched window','A maker measures the glass area or complete boundary of a semicircular window.');
add('sector-area sector-radian arc-length arc-radian chord segment-area','Curved path design','A designer measures a circular sector, curved path, chord or segment, using the specified angle convention.');
add('annulus','Ring-shaped walkway','A landscaper subtracts an inner circular area from an outer circle.');
add('pythagoras-hyp pythagoras-leg','Access ramp survey','A right-triangle model relates perpendicular distances to a diagonal span.');
add('heron triangle-inradius triangle-circumradius triangle-sine-area cosine-side sine-rule triangle-third-angle','Triangular site survey','A survey worksheet uses consistent sides, angles, area or perimeter of the same triangle.');
add('similar-area similar-volume','Scale-model exhibition','An exhibit is enlarged uniformly; area and volume scale by different powers of the linear factor.');
add('cube-volume cube-surface cube-lateral cube-diagonal','Cubic display box','A maker measures storage space, covering area or an internal diagonal of a cubic box.');
add('cuboid-volume cuboid-surface cuboid-lateral cuboid-diagonal','Shipping carton','A packer measures the space, covering or longest internal diagonal of a rectangular carton.');
add('cylinder-volume cylinder-curved cylinder-total','Cylindrical tank','A tank worksheet distinguishes capacity, curved covering and the complete surface.');
add('cone-volume cone-slant cone-curved cone-total','Conical shade','A designer distinguishes vertical height from slant height when measuring a conical shade.');
add('sphere-volume sphere-surface','Spherical display','A maker measures enclosed space or covering material for a spherical display.');
add('hemisphere-volume hemisphere-curved hemisphere-total','Dome model','A maker measures a hemispherical dome, distinguishing a curved surface from a surface including its base.');
add('frustum-volume frustum-slant frustum-curved frustum-total','Tapered planter','A planter is modeled as a conical frustum with two radii and a perpendicular height.');
add('prism-volume prism-total','Prism-shaped container','A container worksheet combines base measurements with the length of a right prism.');
add('pyramid-volume square-pyramid-surface','Pyramidal display','A maker measures a pyramid using its base, height and the appropriate face geometry.');
add('tetra-volume tetra-surface','Tetrahedral package','A packaging worksheet measures a regular tetrahedron with all edges equal.');
add('euler','Convex frame inspection','A frame inspector counts faces, vertices and edges of a convex polyhedron.');
add('point-distance midpoint-x midpoint-y section-x section-y external-x','Robot waypoint map','A robot map measures a straight distance or places a waypoint at a midpoint or stated division ratio.');
add('slope line-slope point-slope intercept-line perpendicular-slope','Straight path layout','A designer uses a line model to calculate a coordinate, gradient or perpendicular direction.');
add('point-line-distance parallel-distance','Road setback survey','A survey worksheet measures perpendicular separation from a boundary line or between parallel lines.');
add('centroid-x centroid-y coordinate-area','Triangular map parcel','A map worksheet uses vertex coordinates to locate a centroid or calculate area.');
add('circle-upper parabola-up ellipse-upper hyperbola-upper','Digital curve tracing','A graphics tool samples a specific branch of a curve under its stated domain restrictions.');
add('sine cosine tangent cosecant secant cotangent pythagorean-trig tan-identity cot-identity','Rotating pointer model','A rotating pointer worksheet evaluates a trigonometric ratio or checks an identity at a stated angle.');
add('radians degrees','Rotation unit converter','A graphics program converts rotation settings between degrees and radians.');
add('sin-sum sin-difference cos-sum cos-difference tan-sum sin-double cos-double tan-double sin-half cos-half','Combined rotation controller','A graphics worksheet combines, doubles or halves angles using trigonometric identities.');
add('height-distance','Building elevation survey','A surveyor uses a horizontal ground distance and an elevation angle to find height above the observer datum.');
add('inverse-sine inverse-cosine inverse-tangent','Angle recovery tool','A controller recovers a principal angle from a measured ratio.');
add('natural-log common-log log-base log-product log-quotient log-power','Logarithmic instrument model','An instrument worksheet converts positive model quantities to a logarithmic scale.');
add('derivative-power derivative-square derivative-cubic derivative-reciprocal derivative-sqrt derivative-exp derivative-ln derivative-sin derivative-cos derivative-tan derivative-base chain-power product-example quotient-example secant-square second-derivative-cubic','Local change monitor','A numerical model examines instantaneous, average or second-order change of its stated function. Trigonometric calculus uses radians.');
add('integral-power integral-ln integral-sin integral-cos integral-exp','Accumulation model','A numerical worksheet finds one representative antiderivative. Any complete indefinite family also includes a constant C.');
add('definite-square definite-linear definite-constant definite-exp definite-sin definite-cos average-function','Interval accumulation report','A modeled signal is accumulated or averaged over the stated interval; the result is signed when appropriate.');
add('motion-position motion-velocity','Trolley motion model','A trolley is modeled with constant acceleration, time in seconds and consistent SI units.');
add('mean-three weighted-mean range variance-three sample-variance-three standard-deviation z-score coefficient-variation','Quality measurement report','A measurement team compares center, spread or standardized readings using the specified data convention.');
add('probability-classical probability-complement probability-union probability-independent conditional bayes','Event probability model','A planning worksheet evaluates events under the stated equally-likely, independence or conditional assumptions.');
add('binomial-probability binomial-mean binomial-variance','Seed germination model','A tray is modeled by independent trials with the same germination probability.');
add('geometric-probability statistics-probability-geometric-mean','First-success inspection','A worksheet models independent repeated trials until the first success.');
add('poisson-probability','Arrival count model','A simplified arrival model uses a Poisson distribution with a stated positive mean.');
add('expectation-two','Two-outcome planning','A planner computes a probability-weighted expectation, which need not be an actual observed outcome.');
add('experimental-frequency','Sample inspection','An inspector reports the observed fraction of successes in a finite sample.');
add('vector-magnitude dot-product vector-angle unit-vector-x cross-x cross-y cross-z projection','Drone direction worksheet','A drone worksheet compares displacement vectors, alignment, projections or perpendicular components.');
add('matrix-det matrix-trace matrix-x matrix-y rotation-x rotation-y matrix-area','Computer graphics transform','A graphics worksheet applies a matrix or rotation and checks coordinate or area effects.');
add('distance-3d plane-distance','3D survey map','A survey worksheet measures an orthonormal 3D distance or a perpendicular distance to a plane.');
add('complex-modulus complex-product-real complex-product-imag','Complex signal worksheet','A signal-processing worksheet represents two components by a complex number and checks magnitude or multiplication components.');
add('weighted-interpolation','Sensor interpolation','A sensor reading between two calibrated endpoints is modeled as a fraction of their separation.');
add('quadratic-completed quadratic-axis root-separation','Reflector profile design','A quadratic profile is inspected for its axis, turning-point form and the separation of its real intercepts.');
add('cubic-factor-remainder inverse-quadratic-positive absolute-v-shape','Animation curve controller','An animation controller evaluates a supplied curve, retaining the stated input branch and domain.');
add('max-two min-two','Delivery comparison desk','Two comparable delivery quantities are checked to select the larger or smaller measurement.');
add('harmonic-three geometric-three rms-two','Measurement summary desk','A technician selects the stated mean for positive rates, multiplicative scales or squared signal measurements.');
add('circle-sagitta circle-chord-distance circle-radius-from-chord circle-tangent-length','Circular arch survey','A circular arch or tangent segment is measured using the radius, chord and perpendicular distances.');
add('triangle-median triangle-bisector triangle-angle-cosine','Triangular frame survey','A surveyor knows a triangular frame’s three side lengths and needs an internal segment or angle.');
add('ellipse-eccentricity','Elliptical panel design','An elliptical panel is compared by its semi-major and semi-minor axes to quantify its departure from a circle.');
add('tangent-square-value normal-square-value secant-cubic','Motion curve inspection','A motion-curve worksheet compares nearby rates, tangent approximations and perpendicular normal directions.');
add('limit-square-error epsilon-delta-square','Square panel tolerance','A panel’s squared side measurement is checked against a requested output-error tolerance near its target input.');
add('derivative-logistic logistic-population','Habitat growth worksheet','An idealized population model includes a carrying capacity and slows its growth as the population approaches that capacity.');
add('integral-quadratic','Tank inflow worksheet','A supplied quadratic inflow curve is accumulated over a finite time interval, preserving the sign of the model.');
add('taylor-exp-quadratic','Local growth approximation','A numerical program approximates an exponential close to zero with a quadratic Taylor polynomial, rather than claiming exact equality.');
add('weighted-variance-two pooled-mean standard-error-mean','School measurement team','Two weighted readings or group summaries are combined under the assumptions of the specified summary statistic.');
add('normal-density exponential-density exponential-cdf uniform-density','Waiting-time and measurement model','A probability worksheet evaluates a stated continuous density or cumulative probability. A density value is not the probability of one exact reading.');
add('at-least-one bernoulli-variance','Independent quality trials','An inspection worksheet assumes independent binary trials with the same success probability.');
add('inclusion-three','Overlapping club survey','A survey tracks three clubs and all pairwise and triple overlaps without counting shared members more than once.');
add('odds-to-probability probability-to-odds','Outcome report conversion','A report converts success-to-failure odds to a success share, or performs the inverse conversion.');
add('cross-magnitude scalar-triple parallelepiped-volume','Spatial frame construction','A frame designer uses edge-vector components to find a spanned area or a signed or unsigned volume.');
add('matrix-inverse-entry matrix-eigenvalue-plus matrix-eigenvalue-minus','Graphics transformation analysis','A graphics worksheet inspects whether a matrix can be inverted and how its invariant directions are scaled.');
add('complex-quotient-real complex-quotient-imag','Planar signal arithmetic','A numerical signal worksheet divides two complex-component quantities using a nonzero denominator.');
add('annuity-future annuity-present loan-payment effective-annual','Periodic payment worksheet','A student compares idealized fixed-rate payment and deposit schedules with consistent periods. Fees and variable rates are outside this teaching model.');
add('break-even-units unit-contribution','School craft stall plan','A class stall assumes constant selling price and variable cost per item when estimating contribution and break-even quantity.');
add('half-life-remaining','Exponential decay worksheet','A teaching model follows the remaining amount under a constant positive half-life and consistent time units.');
export function contextFor(id:string):SituationContext{const c=contexts[id];if(!c)throw new Error('Missing situation context: '+id);return c}
export const contextIds=Object.keys(contexts);
const settings:Record<string,[string,string][]>={
 'Numbers & arithmetic':[['Community store','A volunteer analyzes counted quantities or signed readings in a stock record.'],['Museum activity','An educator checks number relationships in an interactive counting exhibit.'],['Workshop planning','A maker checks quantities and numerical labels before organizing supplies.'],['Event registration','An organizer checks numerical records, counts or measurement readings.']],
 'Fractions, decimals & ratios':[['Festival catering','A catering worksheet uses shares, decimal readings, ratios or percentage changes.'],['School store','A store worksheet converts and compares quantities under a stated ratio or percentage model.'],['Craft materials','A maker uses fractional measurements and proportional quantities in a materials plan.'],['Community survey','A survey worksheet reports shares or proportional relationships in a common unit.']],
 'Number theory & powers':[['Production scheduling','A scheduling worksheet uses a numerical pattern, divisibility or repeated scaling model.'],['Digital data model','A software worksheet checks exact powers, roots or integer relationships in a numerical model.'],['Pattern exhibition','A designer checks the numerical structure of a repeated geometric or counting pattern.'],['Batch preparation','A workshop worksheet evaluates the stated counting or scale relationship before preparing batches.']],
 'Money & growth':[['School enterprise','An enterprise worksheet evaluates a price, interest, depreciation or growth model with illustrative inputs.'],['Community project budget','A planner checks the stated percentage or growth relationship in a simplified budget worksheet.'],['Model comparison desk','An analyst compares two configurations of a financial or growth model under the same assumptions.'],['Numerical forecast review','A reviewer checks arithmetic in a simplified value or growth forecast. Its rates are illustrative.']],
 'Algebra & identities':[['Design spreadsheet','A designer uses the stated algebraic model to verify a numerical design quantity.'],['Calibration software','A programmer evaluates a supplied algebraic relationship while testing a numerical routine.'],['Planning worksheet','A planner evaluates a mathematical model whose quantities satisfy the displayed algebraic conditions.'],['Model verification desk','A reviewer checks a supplied polynomial, identity or equation calculation before accepting a report.']],
 'Sequences & series':[['Tiered display','A maker uses a sequence model to arrange repeated design elements.'],['Computer animation pattern','A graphics worksheet uses the stated sequence or expansion to organize numerical values.'],['Repeated production plan','A planner evaluates a finite count, a term or a total in the specified progression model.'],['Pattern report review','A reviewer checks a sequence-based numerical report and its indexing assumptions.']],
 'Plane geometry':[['Playground construction','A builder measures a plane shape in a scale drawing of a playground.'],['Fabric cutting desk','A maker checks the measurements of a geometric fabric panel.'],['Exhibition floor plan','A designer evaluates the measurements of a geometric shape on an exhibition plan.'],['Window frame inspection','A reviewer checks the stated measurement of a geometric window frame.']],
 'Circles & triangles':[['Outdoor sculpture design','A designer uses the stated circle or triangle model to measure a sculpture component.'],['Festival installation','A maker measures a curved or triangular element in a festival installation.'],['School ground plan','A planner evaluates a circle or triangle measurement on a scaled ground plan.'],['Survey report review','A reviewer checks a circular, triangular or similarity calculation against its geometric assumptions.']],
 'Solid measurement':[['Packaging design','A maker measures the stated solid when comparing package designs.'],['Display fabrication','A designer checks the measurement of a solid display component.'],['Storage model desk','A planner measures the stated solid in a simplified storage or covering model.'],['Solid measurement inspection','A reviewer checks a report about volume, covering, diagonals or polyhedral counts.']],
 'Coordinate geometry':[['Park waypoint plan','A coordinate worksheet locates points, traces a boundary or evaluates a distance on a park plan.'],['Digital layout editor','A graphics worksheet evaluates the stated line, curve or coordinate construction.'],['Robot map construction','A robot-map worksheet uses a supplied coordinate relationship to construct or measure a map element.'],['Coordinate report review','A reviewer checks the numerical result of a coordinate or curve calculation.']],
 'Trigonometry':[['Robot joint controller','A numerical controller worksheet checks an angle relationship with the stated angle convention.'],['Graphics rotation desk','An animation worksheet evaluates the stated trigonometric relationship or angle conversion.'],['Survey model desk','A survey worksheet evaluates a supplied angle or trigonometric construction under its stated assumptions.'],['Navigation calculation review','A reviewer checks a trigonometric or angle calculation in a simplified navigation worksheet.']],
 'Logarithms & functions':[['Scientific display calibration','An instrument worksheet evaluates the stated positive-scale or function transformation.'],['Numerical software test','A programmer checks a supplied logarithmic, exponential or function-composition routine.'],['Function model comparison','An analyst compares configurations of the stated function model.'],['Instrument report review','A reviewer checks a transformed reading or function output before accepting a numerical report.']],
 'Calculus':[['Animation signal desk','An animation worksheet evaluates change or accumulation in its supplied mathematical signal.'],['Experimental curve model','A laboratory worksheet evaluates a rate or accumulation relationship for a provided numerical model.'],['Engineering signal worksheet','A designer checks the stated derivative, antiderivative, integral or motion relationship under its assumptions.'],['Calculus report review','A reviewer checks a rate or accumulation calculation, including its domain and interval conventions.']],
 'Statistics & probability':[['School data team','A data worksheet evaluates the stated summary, selection count or probability model.'],['Quality inspection plan','An inspection worksheet compares configurations of its stated data or random-event model.'],['Sports analysis worksheet','An analyst evaluates a supplied data-summary, counting or probability relationship.'],['Survey model review','A reviewer checks the stated statistical or probability calculation and its assumptions.']],
 'Vectors, matrices & 3D coordinates':[['Robotics numerical controller','A controller worksheet evaluates the stated component, transformation or spatial relationship.'],['Computer graphics desk','A graphics worksheet evaluates a numerical transformation, component or coordinate model.'],['Spatial signal model','An analyst checks the stated vector, matrix, coordinate or complex-component relationship in a supplied model.'],['Transformation report review','A reviewer checks a component, magnitude, coordinate or transformation calculation.']]
};
export function contextsForFormula(f:{id:string;title:string;domain:string}):SituationContext[]{
 const primary=contextFor(f.id),alternatives=settings[f.domain];
 if(!alternatives)throw new Error('Missing situation setting: '+f.domain);
 return [primary,...alternatives.map(([setting,story])=>({setting,story:story+' The relationship being tested is '+f.title.toLowerCase()+'.'}))];
}
