import { CountryInfo, DifficultyLevel, FoodData } from '../types';

export const COUNTRIES: CountryInfo[] = [
  { id: 'JP', name: 'Japan', flag: '🇯🇵' },
  { id: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { id: 'IT', name: 'Italy', flag: '🇮🇹' },
  { id: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { id: 'IN', name: 'India', flag: '🇮🇳' },
  { id: 'FR', name: 'France', flag: '🇫🇷' },
  { id: 'CN', name: 'China', flag: '🇨🇳' },
  { id: 'TH', name: 'Thailand', flag: '🇹🇭' },
];

export const FOOD_POOL: FoodData[] = [
  // ═══════════════════════ JAPAN (JP) ═══════════════════════
  { id: 'food_jp_001', name: 'Sushi', emoji: '🍣', countryId: 'JP', region: 'East Asia', difficultyLevel: 1, microFact: 'Sushi was originally a preservation method using fermented rice.', deepDive: 'Narezushi dates back to the 8th century; the modern nigiri form emerged in 1820s Tokyo as fast food for busy merchants.' },
  { id: 'food_jp_002', name: 'Ramen', emoji: '🍜', countryId: 'JP', region: 'East Asia', difficultyLevel: 1, microFact: 'Japan has over 30,000 ramen shops across the country.', deepDive: 'Originally Chinese, ramen was localized in Japan with regional styles like Tonkotsu (Hakata), Miso (Sapporo), and Shoyu (Tokyo).' },
  { id: 'food_jp_003', name: 'Tempura', emoji: '🍤', countryId: 'JP', region: 'East Asia', difficultyLevel: 1, microFact: 'Tempura was introduced to Japan by Portuguese missionaries in the 16th century.', deepDive: 'The word likely comes from "tempora," referring to Lenten fasting periods when fried food was eaten instead of meat.' },
  { id: 'food_jp_004', name: 'Takoyaki', emoji: '🐙', countryId: 'JP', region: 'East Asia', difficultyLevel: 1, microFact: 'Takoyaki are ball-shaped snacks filled with minced octopus.', deepDive: 'Created in Osaka in 1935, they are cooked in special molded pans and topped with sauce, mayo, and bonito flakes.' },
  { id: 'food_jp_005', name: 'Mochi', emoji: '🍡', countryId: 'JP', region: 'East Asia', difficultyLevel: 1, microFact: 'Mochi is made by pounding glutinous rice into a sticky paste.', deepDive: 'Traditionally prepared during Japanese New Year, mochi-pounding ceremonies (mochitsuki) remain an important cultural event.' },
  { id: 'food_jp_006', name: 'Onigiri', emoji: '🍙', countryId: 'JP', region: 'East Asia', difficultyLevel: 2, microFact: 'Onigiri rice balls date back to the 11th century as portable samurai meals.', deepDive: 'Modern convenience stores sell over 2 billion onigiri annually in Japan, with hundreds of filling varieties.' },
  { id: 'food_jp_007', name: 'Yakitori', emoji: '🍗', countryId: 'JP', region: 'East Asia', difficultyLevel: 2, microFact: 'Yakitori are skewered chicken pieces grilled over charcoal.', deepDive: 'Post-WWII food stalls popularized yakitori using all parts of the chicken, turning it into affordable street food.' },
  { id: 'food_jp_008', name: 'Okonomiyaki', emoji: '🥞', countryId: 'JP', region: 'East Asia', difficultyLevel: 2, microFact: 'Okonomiyaki means "grilled as you like it" in Japanese.', deepDive: 'Hiroshima-style layers ingredients while Osaka-style mixes them into the batter—both cities fiercely debate which is superior.' },
  { id: 'food_jp_009', name: 'Natto', emoji: '🫘', countryId: 'JP', region: 'East Asia', difficultyLevel: 3, microFact: 'Natto is fermented soybeans known for their strong smell and sticky texture.', deepDive: 'Rich in vitamin K2 and probiotics, natto has been eaten in Japan for over 1,000 years despite dividing even locals.' },
  { id: 'food_jp_010', name: 'Taiyaki', emoji: '🐟', countryId: 'JP', region: 'East Asia', difficultyLevel: 3, microFact: 'Taiyaki is a fish-shaped cake typically filled with sweet red bean paste.', deepDive: 'First made in Tokyo in 1909, the fish shape was chosen because real tai (sea bream) was an expensive luxury.' },

  // ═══════════════════════ MEXICO (MX) ═══════════════════════
  { id: 'food_mx_001', name: 'Tacos', emoji: '🌮', countryId: 'MX', region: 'Latin America', difficultyLevel: 1, microFact: 'Tacos predate the arrival of Europeans in Mexico.', deepDive: 'The word "taco" likely comes from Nahuatl "tlahco," meaning "half" or "in the middle," describing the folded tortilla.' },
  { id: 'food_mx_002', name: 'Burrito', emoji: '🌯', countryId: 'MX', region: 'Latin America', difficultyLevel: 1, microFact: 'The burrito originated in northern Mexico near the U.S. border.', deepDive: 'Legend says a street vendor named Juan Méndez wrapped food in flour tortillas to keep it warm during transport by donkey.' },
  { id: 'food_mx_003', name: 'Churros', emoji: '🍩', countryId: 'MX', region: 'Latin America', difficultyLevel: 1, microFact: 'Churros were brought to Latin America by Spanish shepherds.', deepDive: 'Spanish shepherds created churros as a substitute for fresh bread, frying dough in the mountains where bakeries were scarce.' },
  { id: 'food_mx_004', name: 'Nachos', emoji: '🧀', countryId: 'MX', region: 'Latin America', difficultyLevel: 1, microFact: 'Nachos were invented in 1943 by Ignacio "Nacho" Anaya in Piedras Negras.', deepDive: 'Anaya improvised the dish when U.S. military wives arrived at his restaurant after closing time, using what was available.' },
  { id: 'food_mx_005', name: 'Guacamole', emoji: '🥑', countryId: 'MX', region: 'Latin America', difficultyLevel: 1, microFact: 'The Aztecs first made guacamole around the 16th century.', deepDive: 'The name comes from the Nahuatl word "āhuacamolli," meaning avocado sauce, and it was considered an aphrodisiac.' },
  { id: 'food_mx_006', name: 'Tamales', emoji: '🫔', countryId: 'MX', region: 'Latin America', difficultyLevel: 2, microFact: 'Tamales have been made in Mesoamerica since 8000-5000 BCE.', deepDive: 'They were portable food for hunters, travelers, and soldiers, wrapped in corn husks or banana leaves for preservation.' },
  { id: 'food_mx_007', name: 'Elote', emoji: '🌽', countryId: 'MX', region: 'Latin America', difficultyLevel: 2, microFact: 'Elote is grilled corn on the cob sold by street vendors across Mexico.', deepDive: 'Typically slathered with mayo, chili powder, lime juice, and cotija cheese, it is one of Mexico\'s most iconic street foods.' },
  { id: 'food_mx_008', name: 'Pozole', emoji: '🍲', countryId: 'MX', region: 'Latin America', difficultyLevel: 2, microFact: 'Pozole was a sacred dish used in Aztec ceremonies.', deepDive: 'After the Spanish conquest, pork replaced the original protein, and it became a celebratory dish for holidays and gatherings.' },
  { id: 'food_mx_009', name: 'Mole', emoji: '🍫', countryId: 'MX', region: 'Latin America', difficultyLevel: 3, microFact: 'Mole can contain over 20 ingredients including chocolate and chili peppers.', deepDive: 'Originating in Puebla or Oaxaca, preparing authentic mole can take days and represents a labor of love for celebrations.' },
  { id: 'food_mx_010', name: 'Birria', emoji: '🥘', countryId: 'MX', region: 'Latin America', difficultyLevel: 3, microFact: 'Birria is a spicy stew traditionally made with goat meat from Jalisco.', deepDive: 'Originally considered peasant food, birria has recently become a global trend through crispy, cheese-topped birria tacos.' },

  // ═══════════════════════ ITALY (IT) ═══════════════════════
  { id: 'food_it_001', name: 'Pizza', emoji: '🍕', countryId: 'IT', region: 'Europe', difficultyLevel: 1, microFact: 'Modern pizza originated in Naples in the 18th century.', deepDive: 'The Margherita pizza was named after Queen Margherita of Italy in 1889, using tomato, mozzarella, and basil for the Italian flag.' },
  { id: 'food_it_002', name: 'Pasta', emoji: '🍝', countryId: 'IT', region: 'Europe', difficultyLevel: 1, microFact: 'Italy produces over 3 million tons of pasta annually.', deepDive: 'There are over 350 recognized pasta shapes, each designed to hold specific sauces—ridged for thick sauces, smooth for light ones.' },
  { id: 'food_it_003', name: 'Gelato', emoji: '🍨', countryId: 'IT', region: 'Europe', difficultyLevel: 1, microFact: 'Gelato has less fat and air than regular ice cream, making it denser.', deepDive: 'Bernardo Buontalenti is credited with inventing modern gelato in 16th century Florence for the Medici court.' },
  { id: 'food_it_004', name: 'Lasagna', emoji: '🍝', countryId: 'IT', region: 'Europe', difficultyLevel: 1, microFact: 'Lasagna is one of the oldest and most iconic forms of pasta.', deepDive: 'The first recorded recipe appears in a 14th century English cookbook called "Forme of Cury," though it originated in Italy.' },
  { id: 'food_it_005', name: 'Bruschetta', emoji: '🍞', countryId: 'IT', region: 'Europe', difficultyLevel: 1, microFact: 'Bruschetta started as a way for olive oil producers to taste-test new oil.', deepDive: 'The name comes from "bruscare," meaning to roast over coals, and it remains a staple antipasto across Italy.' },
  { id: 'food_it_006', name: 'Risotto', emoji: '🍚', countryId: 'IT', region: 'Europe', difficultyLevel: 2, microFact: 'Proper risotto takes about 18 minutes of constant stirring.', deepDive: 'The technique of toasting rice in butter before slowly adding broth creates the signature creamy, velvety texture.' },
  { id: 'food_it_007', name: 'Tiramisu', emoji: '🍰', countryId: 'IT', region: 'Europe', difficultyLevel: 2, microFact: 'Tiramisu means "pick me up" or "lift me up" in Italian.', deepDive: 'Likely invented in the 1960s in the Veneto region, it combines espresso-soaked ladyfingers with mascarpone cream.' },
  { id: 'food_it_008', name: 'Arancini', emoji: '🍙', countryId: 'IT', region: 'Europe', difficultyLevel: 2, microFact: 'Arancini are fried rice balls from Sicily coated in breadcrumbs.', deepDive: 'Named for their resemblance to small oranges (arancia), they were created as portable food for workers and travelers.' },
  { id: 'food_it_009', name: 'Cacio e Pepe', emoji: '🧀', countryId: 'IT', region: 'Europe', difficultyLevel: 3, microFact: 'Cacio e Pepe uses only three ingredients: pasta, Pecorino Romano, and black pepper.', deepDive: 'Roman shepherds carried these non-perishable ingredients during long journeys with their flocks through the countryside.' },
  { id: 'food_it_010', name: 'Osso Buco', emoji: '🍖', countryId: 'IT', region: 'Europe', difficultyLevel: 3, microFact: 'Osso Buco means "bone with a hole" referring to the marrow bone.', deepDive: 'This Milanese specialty features braised veal shanks and is traditionally served with gremolata and saffron risotto.' },

  // ═══════════════════════ SOUTH KOREA (KR) ═══════════════════════
  { id: 'food_kr_001', name: 'Kimchi', emoji: '🥬', countryId: 'KR', region: 'East Asia', difficultyLevel: 1, microFact: 'There are over 200 varieties of kimchi in Korea.', deepDive: 'Kimchi fermentation was originally developed as a way to preserve vegetables through Korea\'s harsh winters.' },
  { id: 'food_kr_002', name: 'Bibimbap', emoji: '🍚', countryId: 'KR', region: 'East Asia', difficultyLevel: 1, microFact: 'Bibimbap means "mixed rice" and was once a royal court dish.', deepDive: 'The Jeonju style is considered the most authentic, traditionally using over 30 colorful garnishes arranged beautifully.' },
  { id: 'food_kr_003', name: 'Bulgogi', emoji: '🥩', countryId: 'KR', region: 'East Asia', difficultyLevel: 1, microFact: 'Bulgogi means "fire meat" and dates back to the Goguryeo era.', deepDive: 'The meat is marinated in soy sauce, sugar, sesame oil, garlic, and pear juice which tenderizes the beef naturally.' },
  { id: 'food_kr_004', name: 'Tteokbokki', emoji: '🌶️', countryId: 'KR', region: 'East Asia', difficultyLevel: 1, microFact: 'Tteokbokki was originally a savory court dish before becoming spicy street food.', deepDive: 'The modern spicy gochujang version was popularized in the 1950s in Seoul and is now Korea\'s favorite street snack.' },
  { id: 'food_kr_005', name: 'Korean Fried Chicken', emoji: '🍗', countryId: 'KR', region: 'East Asia', difficultyLevel: 1, microFact: 'Korean fried chicken is double-fried for extra crunchiness.', deepDive: 'The double-frying technique removes moisture from the skin, creating a thin, ultra-crispy coating that stays crunchy longer.' },
  { id: 'food_kr_006', name: 'Gimbap', emoji: '🍙', countryId: 'KR', region: 'East Asia', difficultyLevel: 2, microFact: 'Gimbap looks similar to sushi but uses sesame oil instead of vinegar.', deepDive: 'Popular as picnic and lunch food, gimbap fillings range from bulgogi to tuna to cheese, making it endlessly versatile.' },
  { id: 'food_kr_007', name: 'Japchae', emoji: '🍜', countryId: 'KR', region: 'East Asia', difficultyLevel: 2, microFact: 'Japchae was originally a vegetable dish served to Korean royalty.', deepDive: 'Sweet potato glass noodles were added centuries later, creating the colorful stir-fry now served at every Korean celebration.' },
  { id: 'food_kr_008', name: 'Hotteok', emoji: '🫓', countryId: 'KR', region: 'East Asia', difficultyLevel: 2, microFact: 'Hotteok is a sweet pancake filled with brown sugar, honey, and nuts.', deepDive: 'Introduced by Chinese immigrants in the 19th century, it became Korea\'s most beloved winter street food.' },
  { id: 'food_kr_009', name: 'Sundae', emoji: '🌭', countryId: 'KR', region: 'East Asia', difficultyLevel: 3, microFact: 'Korean sundae is blood sausage made with glass noodles, not an ice cream dessert.', deepDive: 'This savory sausage has been eaten since the Goryeo dynasty and is a popular street food served with liver and lungs.' },
  { id: 'food_kr_010', name: 'Bindaetteok', emoji: '🥞', countryId: 'KR', region: 'East Asia', difficultyLevel: 3, microFact: 'Bindaetteok is a savory mung bean pancake from the Joseon era.', deepDive: 'Originally called "binjatteok" (poor man\'s pancake), it was affordable food for commoners made from ground mung beans.' },

  // ═══════════════════════ INDIA (IN) ═══════════════════════
  { id: 'food_in_001', name: 'Curry', emoji: '🍛', countryId: 'IN', region: 'South Asia', difficultyLevel: 1, microFact: 'The word "curry" comes from the Tamil word "kari," meaning sauce.', deepDive: 'Indian curries vary enormously by region, from creamy Mughlai kormas to fiery Chettinad pepper curries.' },
  { id: 'food_in_002', name: 'Samosa', emoji: '🥟', countryId: 'IN', region: 'South Asia', difficultyLevel: 1, microFact: 'Samosas originated in Central Asia and arrived in India via trade routes.', deepDive: 'The triangular pastry filled with spiced potatoes is one of the world\'s most popular snacks, eaten across continents.' },
  { id: 'food_in_003', name: 'Naan', emoji: '🫓', countryId: 'IN', region: 'South Asia', difficultyLevel: 1, microFact: 'Naan was first mentioned by Indo-Persian poet Amir Khusro in 1300 CE.', deepDive: 'Traditional naan is baked in a tandoor clay oven at extremely high heat, giving it distinctive charred bubbles.' },
  { id: 'food_in_004', name: 'Biryani', emoji: '🍚', countryId: 'IN', region: 'South Asia', difficultyLevel: 1, microFact: 'There are over 26 regional varieties of biryani in India.', deepDive: 'The dish evolved from Persian pilaf, enriched with Indian spices during Mughal rule, with Hyderabadi being the most famous.' },
  { id: 'food_in_005', name: 'Tandoori Chicken', emoji: '🍗', countryId: 'IN', region: 'South Asia', difficultyLevel: 1, microFact: 'Tandoori chicken gets its red color from a blend of spices and yogurt marinade.', deepDive: 'Invented at Moti Mahal restaurant in Delhi in the 1920s, it became India\'s most internationally recognized dish.' },
  { id: 'food_in_006', name: 'Dosa', emoji: '🫓', countryId: 'IN', region: 'South Asia', difficultyLevel: 2, microFact: 'Dosa is a crispy crepe made from fermented rice and lentil batter.', deepDive: 'Originating in South India over 2,000 years ago, dosa has become a breakfast staple served with sambar and chutney.' },
  { id: 'food_in_007', name: 'Pakora', emoji: '🧆', countryId: 'IN', region: 'South Asia', difficultyLevel: 2, microFact: 'Pakoras are vegetables dipped in gram flour batter and deep-fried.', deepDive: 'The quintessential Indian rainy-day snack, pakoras are best enjoyed hot with chai during monsoon season.' },
  { id: 'food_in_008', name: 'Gulab Jamun', emoji: '🍩', countryId: 'IN', region: 'South Asia', difficultyLevel: 2, microFact: 'Gulab Jamun means "rose water berry" in Hindi.', deepDive: 'These deep-fried milk dumplings soaked in rose-scented sugar syrup are the most ordered dessert in Indian restaurants worldwide.' },
  { id: 'food_in_009', name: 'Pani Puri', emoji: '💧', countryId: 'IN', region: 'South Asia', difficultyLevel: 3, microFact: 'Pani Puri is a hollow crispy sphere filled with spiced flavored water.', deepDive: 'Known as Golgappa in the north and Puchka in the east, this one-bite street food delivers an explosion of flavors.' },
  { id: 'food_in_010', name: 'Vada Pav', emoji: '🍔', countryId: 'IN', region: 'South Asia', difficultyLevel: 3, microFact: 'Vada Pav is Mumbai\'s most iconic street food, often called the Indian burger.', deepDive: 'Created in 1966 by Ashok Vaidya outside Dadar station, it feeds millions of Mumbai commuters daily for just pennies.' },

  // ═══════════════════════ FRANCE (FR) ═══════════════════════
  { id: 'food_fr_001', name: 'Croissant', emoji: '🥐', countryId: 'FR', region: 'Europe', difficultyLevel: 1, microFact: 'The croissant was actually inspired by the Austrian kipferl pastry.', deepDive: 'Viennese baker August Zang brought the recipe to Paris in the 1830s, where French bakers refined it with laminated dough.' },
  { id: 'food_fr_002', name: 'Baguette', emoji: '🥖', countryId: 'FR', region: 'Europe', difficultyLevel: 1, microFact: 'French law dictates baguettes can only contain flour, water, salt, and yeast.', deepDive: 'In 2022, the French baguette-making tradition was added to UNESCO\'s Intangible Cultural Heritage list.' },
  { id: 'food_fr_003', name: 'Crêpe', emoji: '🥞', countryId: 'FR', region: 'Europe', difficultyLevel: 1, microFact: 'Crêpes originated in Brittany in northwest France.', deepDive: 'February 2nd is La Chandeleur in France, celebrated by making crêpes—flipping one with a coin in hand brings luck.' },
  { id: 'food_fr_004', name: 'Macaron', emoji: '🍪', countryId: 'FR', region: 'Europe', difficultyLevel: 1, microFact: 'The modern sandwich macaron was created by Ladurée bakery in the 1930s.', deepDive: 'Catherine de Medici brought the original single-cookie version from Italy to France in the 16th century.' },
  { id: 'food_fr_005', name: 'Ratatouille', emoji: '🍲', countryId: 'FR', region: 'Europe', difficultyLevel: 1, microFact: 'Ratatouille is a Provençal vegetable stew from Nice.', deepDive: 'Originally a humble peasant dish, it gained worldwide fame through the 2007 Pixar animated film of the same name.' },
  { id: 'food_fr_006', name: 'Quiche', emoji: '🥧', countryId: 'FR', region: 'Europe', difficultyLevel: 2, microFact: 'Quiche Lorraine originally had no cheese—just eggs, cream, and smoked bacon.', deepDive: 'The dish originated in the Lorraine region of northeastern France during the medieval period as a hearty meal.' },
  { id: 'food_fr_007', name: 'Escargot', emoji: '🐌', countryId: 'FR', region: 'Europe', difficultyLevel: 2, microFact: 'The French consume about 40,000 tons of snails annually.', deepDive: 'Escargot preparation dates to ancient Rome but was refined into French haute cuisine with garlic-herb butter.' },
  { id: 'food_fr_008', name: 'Crème Brûlée', emoji: '🍮', countryId: 'FR', region: 'Europe', difficultyLevel: 2, microFact: 'The origin of crème brûlée is disputed between France, England, and Spain.', deepDive: 'The signature caramelized sugar top is traditionally made with a kitchen torch, creating a satisfying crack when tapped.' },
  { id: 'food_fr_009', name: 'Cassoulet', emoji: '🍲', countryId: 'FR', region: 'Europe', difficultyLevel: 3, microFact: 'Cassoulet is a slow-cooked casserole named after its cooking pot, the cassole.', deepDive: 'Three French cities—Castelnaudary, Toulouse, and Carcassonne—each fiercely claim to have the authentic recipe.' },
  { id: 'food_fr_010', name: 'Bouillabaisse', emoji: '🐟', countryId: 'FR', region: 'Europe', difficultyLevel: 3, microFact: 'Bouillabaisse is a Provençal fish stew from the port city of Marseille.', deepDive: 'Originally a fisherman\'s meal made from the unsold catch of the day, it now features premium Mediterranean seafood.' },

  // ═══════════════════════ CHINA (CN) ═══════════════════════
  { id: 'food_cn_001', name: 'Dumplings', emoji: '🥟', countryId: 'CN', region: 'East Asia', difficultyLevel: 1, microFact: 'Chinese dumplings (jiaozi) are over 1,800 years old.', deepDive: 'Eating dumplings during Chinese New Year symbolizes wealth because their shape resembles ancient gold ingots.' },
  { id: 'food_cn_002', name: 'Fried Rice', emoji: '🍚', countryId: 'CN', region: 'East Asia', difficultyLevel: 1, microFact: 'Fried rice was invented as a practical way to use leftover rice.', deepDive: 'The Yangzhou style, with shrimp, pork, and vegetables, is considered the definitive version of this global staple.' },
  { id: 'food_cn_003', name: 'Spring Rolls', emoji: '🌯', countryId: 'CN', region: 'East Asia', difficultyLevel: 1, microFact: 'Spring rolls were originally eaten during the Spring Festival.', deepDive: 'The thin golden wrappers symbolize gold bars, representing wealth and prosperity for the coming new year.' },
  { id: 'food_cn_004', name: 'Peking Duck', emoji: '🦆', countryId: 'CN', region: 'East Asia', difficultyLevel: 1, microFact: 'Peking Duck has been served since the Imperial era, dating back to 1330.', deepDive: 'The duck is inflated to separate skin from meat, glazed with maltose, and roasted until the skin is perfectly lacquered.' },
  { id: 'food_cn_005', name: 'Kung Pao Chicken', emoji: '🌶️', countryId: 'CN', region: 'East Asia', difficultyLevel: 1, microFact: 'Kung Pao Chicken is named after Ding Baozhen, a Qing Dynasty governor.', deepDive: 'The original Sichuan version features peanuts, dried chili peppers, and mouth-numbing Sichuan peppercorn.' },
  { id: 'food_cn_006', name: 'Mapo Tofu', emoji: '🧈', countryId: 'CN', region: 'East Asia', difficultyLevel: 2, microFact: 'Mapo Tofu was created by a pockmarked old woman in 1860s Chengdu.', deepDive: '"Mapo" literally means "pockmarked grandmother"—the dish honors the original cook\'s legendary recipe.' },
  { id: 'food_cn_007', name: 'Char Siu', emoji: '🍖', countryId: 'CN', region: 'East Asia', difficultyLevel: 2, microFact: 'Char Siu means "fork-roasted" in Cantonese.', deepDive: 'The distinctive red color comes from fermented red bean curd in the marinade, and it\'s a staple in Cantonese BBQ shops.' },
  { id: 'food_cn_008', name: 'Baozi', emoji: '🥟', countryId: 'CN', region: 'East Asia', difficultyLevel: 2, microFact: 'Baozi are steamed filled buns that have been a Chinese staple for 1,700 years.', deepDive: 'Legend credits their invention to strategist Zhuge Liang during the Three Kingdoms period as offerings to river spirits.' },
  { id: 'food_cn_009', name: 'Xiaolongbao', emoji: '🥟', countryId: 'CN', region: 'East Asia', difficultyLevel: 3, microFact: 'Xiaolongbao contain hot soup sealed inside a delicate dumpling wrapper.', deepDive: 'The soup is created by adding meat aspic to the filling, which melts during steaming into a flavorful broth.' },
  { id: 'food_cn_010', name: 'Zongzi', emoji: '🫔', countryId: 'CN', region: 'East Asia', difficultyLevel: 3, microFact: 'Zongzi are sticky rice parcels wrapped in bamboo leaves.', deepDive: 'Eaten during the Dragon Boat Festival, they commemorate the poet Qu Yuan who drowned himself in protest.' },

  // ═══════════════════════ THAILAND (TH) ═══════════════════════
  { id: 'food_th_001', name: 'Pad Thai', emoji: '🍜', countryId: 'TH', region: 'Southeast Asia', difficultyLevel: 1, microFact: 'Pad Thai was promoted as a national dish during WWII to unify Thai identity.', deepDive: 'Prime Minister Phibunsongkhram launched a noodle campaign to reduce rice consumption and promote Thai nationalism.' },
  { id: 'food_th_002', name: 'Tom Yum', emoji: '🍲', countryId: 'TH', region: 'Southeast Asia', difficultyLevel: 1, microFact: 'Tom Yum is one of the most famous soups in the world.', deepDive: 'The balance of sour, spicy, salty, and sweet exemplifies the Thai philosophy of harmonious, layered flavors.' },
  { id: 'food_th_003', name: 'Green Curry', emoji: '🍛', countryId: 'TH', region: 'Southeast Asia', difficultyLevel: 1, microFact: 'Green curry gets its color from fresh green chili peppers and herbs.', deepDive: 'Despite being called "curry," Thai green curry is thinner, more coconut-based, and herbaceous compared to Indian curries.' },
  { id: 'food_th_004', name: 'Mango Sticky Rice', emoji: '🥭', countryId: 'TH', region: 'Southeast Asia', difficultyLevel: 1, microFact: 'Mango Sticky Rice is Thailand\'s most beloved dessert.', deepDive: 'The glutinous rice is soaked in sweetened coconut cream, then served with ripe mango during the hot season.' },
  { id: 'food_th_005', name: 'Som Tam', emoji: '🥗', countryId: 'TH', region: 'Southeast Asia', difficultyLevel: 1, microFact: 'Som Tam is a spicy green papaya salad from northeast Thailand.', deepDive: 'A proper som tam is pounded in a clay mortar with ingredients added in a specific order for the perfect balance.' },
  { id: 'food_th_006', name: 'Massaman Curry', emoji: '🍛', countryId: 'TH', region: 'Southeast Asia', difficultyLevel: 2, microFact: 'Massaman Curry was influenced by Persian and Malay trading cultures.', deepDive: 'CNN named it the world\'s #1 most delicious food in their 2011 global survey of 50 best foods.' },
  { id: 'food_th_007', name: 'Satay', emoji: '🍢', countryId: 'TH', region: 'Southeast Asia', difficultyLevel: 2, microFact: 'Thai satay was adapted from Malay and Indonesian grilled skewers.', deepDive: 'Thai satay is typically served with rich peanut sauce, cucumber-vinegar relish, and small pieces of toast.' },
  { id: 'food_th_008', name: 'Khao Soi', emoji: '🍜', countryId: 'TH', region: 'Southeast Asia', difficultyLevel: 2, microFact: 'Khao Soi is a Burmese-influenced coconut curry noodle soup from Chiang Mai.', deepDive: 'The dish uniquely features both soft boiled egg noodles in the broth and crispy fried noodles on top for contrast.' },
  { id: 'food_th_009', name: 'Larb', emoji: '🥗', countryId: 'TH', region: 'Southeast Asia', difficultyLevel: 3, microFact: 'Larb is the national dish of Laos and hugely popular in Isaan, Thailand.', deepDive: 'This spicy minced meat salad uses toasted rice powder (khao khua) for its distinctive nutty crunch and texture.' },
  { id: 'food_th_010', name: 'Boat Noodles', emoji: '🍜', countryId: 'TH', region: 'Southeast Asia', difficultyLevel: 3, microFact: 'Boat Noodles were originally sold from boats along Bangkok\'s canals.', deepDive: 'Known for their intensely flavorful, dark broth which traditionally included pig blood for richness and color.' },
];

export function getCountryInfo(countryId: string): CountryInfo | undefined {
  return COUNTRIES.find(c => c.id === countryId);
}

export function getFoodsForCountry(countryId: string, maxDifficulty: DifficultyLevel): FoodData[] {
  return FOOD_POOL.filter(f => f.countryId === countryId && f.difficultyLevel <= maxDifficulty);
}

export function getDistractorFoods(excludeCountryId: string, maxDifficulty: DifficultyLevel): FoodData[] {
  return FOOD_POOL.filter(f => f.countryId !== excludeCountryId && f.difficultyLevel <= maxDifficulty);
}

export function getRandomFood(targetCountryId: string, difficulty: DifficultyLevel): FoodData {
  const isTarget = Math.random() < 0.45;
  const pool = isTarget
    ? getFoodsForCountry(targetCountryId, difficulty)
    : getDistractorFoods(targetCountryId, difficulty);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function shuffleCountries(excludeFirst?: string): CountryInfo[] {
  const list = [...COUNTRIES].sort(() => Math.random() - 0.5);
  if (excludeFirst) {
    const idx = list.findIndex(c => c.id === excludeFirst);
    if (idx > 0) {
      const [item] = list.splice(idx, 1);
      list.unshift(item);
    }
  }
  return list;
}
